import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';
import 'package:provider/provider.dart';
import 'package:theia/controller/provider/occurrence_provider.dart';
import 'package:theia/model/occurance_state.dart';
import 'package:theia/view/component/top_bar.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import '../../controller/provider/user_provider.dart';
import '../../model/filter.dart';
import '../../model/occurrence.dart';
import '../../model/occurrence_type.dart';
import '../../model/order.dart';
import '../component/bottom_bar.dart';
import '../component/occurrence_card.dart';
import '../../constants.dart';

class OccurrencesPage extends StatefulWidget {
  const OccurrencesPage({super.key});

  @override
  State<StatefulWidget> createState() {
    return _OccurrencesPageState();
  }
}

class _OccurrencesPageState extends State<OccurrencesPage> {
  final PagingController<int, Occurrence> _pagingController =
      PagingController(firstPageKey: 0);

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
        currentIndex: 3);
  }

  int? type;

  OccurrenceState? occurrenceState;
  Order order = Order.descendant;
  late String from;
  late String to;
  late final String fromMax;
  late final String toMax;

  List<String> types = [];
  List<OccurrenceType> typesAndIds = [];

  late Future<void> init;

  @override
  void initState() {
    _pagingController.addPageRequestListener((pageKey) {
      _fetchPage(pageKey);
    });

    init = initVariables();
    super.initState();
  }

  @override
  void dispose() {
    _pagingController.dispose();
    super.dispose();
  }

  Future<void> _fetchPage(int pageKey) async {
    try {

      List<Occurrence> newItems =
          await Provider.of<OccurrenceProvider>(context, listen: false)
              .getOccurrences(
                  pageKey,
                  Provider.of<UserProvider>(context, listen: false).token!,
                  Provider.of<UserProvider>(context, listen: false).email!,
                  order,
                  occurrenceState,
                  type,
                  from,
                  to,
                  context);

      final isLastPage = newItems.length < OccurrenceProvider.pageSize;
      if (isLastPage) {
        _pagingController.appendLastPage(newItems);
      } else {
        final nextPageKey = pageKey + 1;
        _pagingController.appendPage(newItems, nextPageKey);
      }
    } catch (error) {
      // Handle any errors by setting the error state on the paging controller
      _pagingController.error = error;
      log(error.toString());
    }
  }

  Future<void> initVariables() async {
    var dates = await Provider.of<OccurrenceProvider>(context, listen: false)
        .getDateLimits(Provider.of<UserProvider>(context, listen: false).token!,
            Provider.of<UserProvider>(context, listen: false).email!, context);

    setState(() {
      from = dates[0];
      fromMax = dates[0];

      to = dates[1];
      toMax = dates[1];
    });

    if (mounted) {
      types = [
        AppLocalizations.of(context)!.all("male"),
      ];

      typesAndIds =
          await Provider.of<OccurrenceProvider>(context, listen: false)
              .getOccurrenceTypes(context);

      for (var type in typesAndIds) {
        types.add(type.name);
      }
    }
  }

  _onOccurrenceStateChanged(String state) {
    setState(() {



      occurrenceState = OccurrenceState.fromLocalizedString(state, context);
      _pagingController.refresh();
    });
  }

  _onTypeChanged(String newType) {
    setState(() {
      log(newType);
      if(newType ==  AppLocalizations.of(context)!.all("male")){
        type = null;
      }else{
        type = typesAndIds.firstWhere((type) => type.name == newType).id;
      }

      log(type.toString());
      _pagingController.refresh();
    });
  }

  _onOrderChange(Order newOrder) {
    setState(() {
      order = newOrder;
      _pagingController.refresh();
    });
  }

  _onDatesChanges(String newFrom, String newTo) {
    setState(() {
      from = newFrom;
      to = newTo;
      _pagingController.refresh();
    });
  }

  Widget getBody() {
    List<String> states = getLocalizedOccurrenceStates(context);

    Filter stateFilter = Filter(AppLocalizations.of(context)!.state, states,
        true, _onOccurrenceStateChanged);

    Filter typeFilter = Filter(
        AppLocalizations.of(context)!.type, types, false, _onTypeChanged);

    return Container(
        decoration: const BoxDecoration(color: theiaAppBarGray),
        child: Column(children: [
          TopBar(
              text: AppLocalizations.of(context)!.occurrences,
              orderIcon: true,
              dateFilter: true,
              otherFilters: [typeFilter, stateFilter],
              oldest: fromMax,
              until: toMax,
              onOrderChange: _onOrderChange,
              onDateChange: _onDatesChanges,
              toolTip: AppLocalizations.of(context)!.occurrences_info,
          ),
          Expanded(
              child: RefreshIndicator(
            onRefresh: () => Future.sync(
              () => _pagingController.refresh(),
            ),
            child: PagedListView<int, Occurrence>(
              pagingController: _pagingController,
              builderDelegate: PagedChildBuilderDelegate<Occurrence>(
                itemBuilder: (context, item, index) => getOccurrenceCard(
                    item, index, _pagingController.itemList?.length ?? 0),
                noItemsFoundIndicatorBuilder: (context) => Container(
                  margin: const EdgeInsets.all(20),
                  child: Center(
                    child: Text(
                      textAlign: TextAlign.center,
                      AppLocalizations.of(context)!.no_items(
                          AppLocalizations.of(context)!
                              .occurrences
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
                              .occurrences
                              .toLowerCase()),
                      style: const TextStyle(
                          color: theiaDarkPurple,
                          fontSize: 24,
                          fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ),
            ),
          ))
        ]));
  }

  Widget getOccurrenceCard(Occurrence occurrence, int index, int itemCount) {
    // Check if the current item is the last one in the list
    final isLastItem = index == itemCount - 1;

    return GestureDetector(
      onTap: () =>
          Navigator.of(context).pushNamed('/occurrence', arguments: occurrence),
      child: Container(
        margin: EdgeInsets.fromLTRB(20, 0, 20, isLastItem ? 20 : 0),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(index == 0 ? 30 : 0),
            bottom: isLastItem ? const Radius.circular(30) : Radius.zero,
          ),
        ),
        child: OccurrenceCard(occurrence: occurrence),
      ),
    );
  }
}
