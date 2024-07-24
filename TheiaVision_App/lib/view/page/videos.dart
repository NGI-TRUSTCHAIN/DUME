import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';
import 'package:provider/provider.dart';
import 'package:theia/controller/provider/user_provider.dart';
import 'package:theia/controller/provider/video_provider.dart';
import 'package:theia/model/loading_state.dart';
import 'package:theia/model/upload_state_filter.dart';
import 'package:theia/model/upload_state.dart';
import 'package:theia/view/component/top_bar.dart';

import '../../model/filter.dart';
import '../../model/order.dart';
import '../../model/video.dart';
import '../../utils.dart';
import '../component/bottom_bar.dart';
import '../component/video_card.dart';
import '../../constants.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class VideosPage extends StatefulWidget {
  const VideosPage({super.key});

  @override
  State<StatefulWidget> createState() {
    return _VideosPageState();
  }
}

class _VideosPageState extends State<VideosPage> {
  final PagingController<int, Video> _pagingController =
      PagingController(firstPageKey: 0);

  Order order = Order.descendant;
  UploadState? uploadState;
  late String from;
  late String to;
  late String fromMax = DateTime.now().toString();
  late String toMax = DateTime.now().toString();

  late List<String> dates;
  late Future<void> init;
  late VideoProvider _videoProvider;
  late UserProvider _userProvider;

  @override
  void initState() {
    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Safely access the provider
    _videoProvider = Provider.of<VideoProvider>(context, listen: false);
    _userProvider = Provider.of<UserProvider>(context, listen: false);
    init = initDate();
  }

  initDate() async {
    dates = await _videoProvider.getDateLimits(
        _userProvider.token!, _userProvider.email!, context);

    setState(() {
      from = dates[0];
      fromMax = dates[0];

      to = dates[1];
      toMax = dates[1];
    });

    _videoProvider.onChangeItemUploadState = onChangeItemUploadState;
    _videoProvider.onChangeItemUploadStateSize = onChangeItemUploadStateSize;
    _videoProvider.onChangeItemRemove = onChangeItemRemove;
    _videoProvider.onAddItem = onAddItem;
    _videoProvider.onChangeUploadedFrames = onChangeUploadedFrames;

    _pagingController.addPageRequestListener((pageKey) {
      _fetchPage(pageKey);
    });
  }

  onChangeItemUploadStateSize(String id, int? totalSize, int uploadedSize) {
    if (_pagingController.itemList == null) {
      _pagingController.refresh();
      return;
    }

    if (_pagingController.itemList!.any((video) => video.id == id)) {
      if (_pagingController.itemList!
                  .firstWhere((video) => video.id == id)
                  .totalSize ==
              null ||
          _pagingController.itemList!
                  .firstWhere((video) => video.id == id)
                  .uploadedSize ==
              null) {
        _pagingController.itemList!.removeWhere((video) => video.id == id);

        _pagingController.refresh();
      } else {
        if (totalSize != null) {
          _pagingController.itemList!
              .firstWhere((video) => video.id == id)
              .totalSize = totalSize;
        }
        if (_pagingController.itemList!
                .firstWhere((video) => video.id == id)
                .uploadedSize !=
            null) {
          _pagingController.itemList!
              .firstWhere((video) => video.id == id)
              .uploadedSize = uploadedSize;
        } else {
          _pagingController.itemList!
              .firstWhere((video) => video.id == id)
              .uploadedSize = uploadedSize;
        }
      }
    }
  }

  onChangeItemUploadState(String id, UploadState newUploadState) {
    if (_pagingController.itemList == null) {
      _pagingController.refresh();
      return;
    }

    if (_pagingController.itemList!.any((video) => video.id == id)) {
      if (newUploadState != uploadState && uploadState != null) {
        _pagingController.itemList!.removeWhere((video) => video.id == id);
      } else {
        _pagingController.itemList!
            .firstWhere((video) => video.id == id)
            .uploadState = newUploadState;
      }
      _pagingController.notifyListeners();
    }
  }

  onChangeUploadedFrames(String id, int frames) {
    if (_pagingController.itemList == null) {
      _pagingController.refresh();
      return;
    }

    if (_pagingController.itemList!.any((video) => video.id == id)) {
      _pagingController.itemList!
          .firstWhere((video) => video.id == id)
          .receivedFrames = frames;


      _pagingController.notifyListeners();
    }
  }

  onChangeItemRemove(String id) {
    if (_pagingController.itemList == null) {
      _pagingController.refresh();
      return;
    }

    if (_pagingController.itemList!.any((video) => video.id == id)) {
      _pagingController.itemList!.removeWhere((video) => video.id == id);
      _pagingController.notifyListeners();
    }
  }

  onAddItem() {
    if (_pagingController.itemList == null) {
      return;
    }
    showCustomToast(AppLocalizations.of(context)!.new_video);
  }

  Future<void> _fetchPage(int pageKey) async {
    try {
      log('Fetching page: $pageKey');

      log(Provider.of<UserProvider>(context, listen: false).token!.toString());
      log(Provider.of<UserProvider>(context, listen: false).email!.toString());


      final newItems = await Provider.of<VideoProvider>(context, listen: false)
          .getVideos(
              pageKey,
              Provider.of<UserProvider>(context, listen: false).token!,
              Provider.of<UserProvider>(context, listen: false).email!,
              order,
              uploadState,
              from,
              to,
              context,
              isInList);

      if (_videoProvider.getVideosState == LoadingState.error) {
        showCustomToast(_videoProvider.errorMessage);
      }

      log('Fetched ${newItems.length} new items');

      final isLastPage = newItems.length < VideoProvider.pageSize;
      if (isLastPage) {
        _pagingController.appendLastPage(newItems);

      } else {
        final nextPageKey = pageKey + 1;

        _pagingController.appendPage(newItems, nextPageKey);

      }


      _pagingController.itemList!.sort((a, b) {
        DateTime aDate = parseDate(a.startDate);
        DateTime bDate = parseDate(b.startDate);
        log("A $aDate and B $bDate ");
        log("A ${a.startDate} and B ${b.startDate} ");
        log("Compare ${bDate.compareTo(aDate)}");
        if (order == Order.descendant) {
          return bDate.compareTo(aDate);
        } else {
          return aDate.compareTo(bDate);
        }});



    } catch (error) {
      // Handle any errors by setting the error state on the paging controller
      _pagingController.error = error;
      log(error.toString());
    }
  }

  @override
  void dispose() {
    _videoProvider.onChangeItemUploadState = null;
    _videoProvider.onChangeItemUploadStateSize = null;
    _videoProvider.onChangeItemRemove = null;
    _videoProvider.onAddItem = null;
    _videoProvider.onChangeUploadedFrames = null;

    _pagingController.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return CustomBottomNavBar(
        body: FutureBuilder<void>(
            future: init,
            builder: (BuildContext context, AsyncSnapshot<void> snapshot) {
              if (snapshot.connectionState == ConnectionState.done) {
                return getBody();
              }

              return const Center(
                child: CircularProgressIndicator(),
              );
            }),
        currentIndex: 1);
  }

  Widget getVideoCard(Video video, int index, int itemCount) {
    // Check if the current item is the last one in the list
    final isLastItem = index == itemCount - 1;

    return GestureDetector(
      onTap: () => Navigator.of(context).pushNamed('/video', arguments: video),
      child: Container(
        margin: EdgeInsets.fromLTRB(20, 0, 20, isLastItem ? 20 : 0),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(index == 0 ? 30 : 0),
            bottom: isLastItem ? const Radius.circular(30) : Radius.zero,
          ),
        ),
        child: VideoCard(video: video),
      ),
    );
  }

  bool isInList(String id) {

    if(_pagingController.itemList == null){
      return false;
    }

    return _pagingController.itemList!.any((v) => (v.id == id));
  }

  onUploadStateFilterChange(String option) {
    setState(() {
      uploadState = UploadStateFilter.fromLocalizedString(option, context);
      _pagingController.refresh();
    });
  }

  onOrderChange(Order newOrder) {
    setState(() {
      order = newOrder;
      _pagingController.refresh();
    });
  }

  onDatesChanges(String newFrom, String newTo) {
    setState(() {
      from = newFrom;
      to = newTo;
      _pagingController.refresh();
    });
  }

  Widget getBody() {
    List<String> uploadStates = getUploadStateFilterStrings(context);
    Filter uploadStateFilter = Filter(AppLocalizations.of(context)!.uploadState,
        uploadStates, true, onUploadStateFilterChange);

    return Container(
        decoration: const BoxDecoration(color: theiaAppBarGray),
        child: Column(children: [
          TopBar(
            text: AppLocalizations.of(context)!.videos,
            orderIcon: true,
            dateFilter: true,
            otherFilters: [uploadStateFilter],
            oldest: fromMax,
            until: toMax,
            onOrderChange: onOrderChange,
            onDateChange: onDatesChanges,
            toolTip: AppLocalizations.of(context)!.videos_info,
          ),
          Expanded(
              child: RefreshIndicator(
                  onRefresh: () => Future.sync(
                        () => _pagingController.refresh(),
                      ),
                  child: Consumer<VideoProvider>(
                      builder: (context, notificationProvider, child) {
                    return PagedListView<int, Video>(
                      pagingController: _pagingController,
                      builderDelegate: PagedChildBuilderDelegate<Video>(
                        itemBuilder: (context, item, index) => getVideoCard(
                            item,
                            index,
                            _pagingController.itemList?.length ?? 0),
                        noItemsFoundIndicatorBuilder: (context) => Container(
                          margin: const EdgeInsets.all(20),
                          child: Center(
                            child: Text(
                              textAlign: TextAlign.center,
                              AppLocalizations.of(context)!.no_items(
                                  AppLocalizations.of(context)!
                                      .videos
                                      .toLowerCase()),
                              style: const TextStyle(
                                  color: theiaDarkPurple,
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                        firstPageErrorIndicatorBuilder: (context) => Container(
                          margin: const EdgeInsets.all(20),
                          child: Center(
                            child: Text(
                              textAlign: TextAlign.center,
                              AppLocalizations.of(context)!.error_items(
                                  AppLocalizations.of(context)!
                                      .videos
                                      .toLowerCase()),
                              style: const TextStyle(
                                  color: theiaDarkPurple,
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ),
                    );
                  })))
        ]));
  }
}
