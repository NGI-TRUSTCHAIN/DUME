import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:theia/view/component/horizontal_select_menu.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import '../../controller/provider/language_provider.dart';
import '../../model/filter.dart';
import '../../model/order.dart';
import '../../constants.dart';

class FilterBar extends StatefulWidget {
  const FilterBar(
      {super.key,
      required this.dateFilter,
      required this.otherFilters,
      required this.oldest,
      this.showAll = true,
      required this.onOrderChange, required this.onDateChange, required this.until});

  final bool dateFilter;
  final List<Filter> otherFilters;
  final String oldest;
  final String until;

  final bool showAll;
  final Function(Order) onOrderChange;
  final Function(String, String) onDateChange;

  @override
  State<StatefulWidget> createState() {
    return _FilterBarState();
  }
}

class _FilterBarState extends State<FilterBar> with TickerProviderStateMixin {
  late DateTime oldestDate;
  bool ascendant = false;
  late DateTime mostRecentDate;

  @override
  void initState() {
    oldestDate = DateTime.parse(widget.oldest);
    mostRecentDate = DateTime.parse(widget.until);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 10),
      decoration: const BoxDecoration(
        color: theiaDarkPurple,
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(50)),
      ),
      child: Column(
        children: getFilters(),
      ),
    );
  }

  Future<void> _selectDateUntil() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: mostRecentDate,
      firstDate: DateTime.parse(widget.oldest),
      lastDate: DateTime.parse(widget.until),
      builder: (BuildContext context, Widget? child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: theiaDarkPurple, // header background color
              onPrimary: Colors.white, // header text color
              onSurface: Colors.black, // body text color
            ),
            textButtonTheme: TextButtonThemeData(
              style: TextButton.styleFrom(
                foregroundColor: theiaBrightPurple, // button text color
              ),
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null && picked != mostRecentDate) {
      setState(() {
        mostRecentDate = picked;
        widget.onDateChange(oldestDate.toString(),mostRecentDate.toString());
      });
    }
  }

  Future<void> _selectDateFrom() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: oldestDate,
      firstDate: DateTime.parse(widget.oldest),
      lastDate: DateTime.parse(widget.until),
      builder: (BuildContext context, Widget? child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: theiaDarkPurple, // header background color
              onPrimary: Colors.white, // header text color
              onSurface: Colors.black, // body text color
            ),
            textButtonTheme: TextButtonThemeData(
              style: TextButton.styleFrom(
                foregroundColor: theiaBrightPurple, // button text color
              ),
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null && picked != oldestDate) {
      setState(() {
        oldestDate = picked;
        widget.onDateChange(oldestDate.toString(),mostRecentDate.toString());
      });
    }
  }

  Widget animateSize(Widget filter) {
    return AnimatedSize(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeInOut,
        child: SizedBox(height: widget.showAll ? null : 0, child: filter));
  }

  List<Widget> getFilters() {
    List<Widget> list = [];

    if (widget.dateFilter) {
      list.add(animateSize(getDateFilter()));
      list.add(animateSize(
        const SizedBox(
          height: 10,
        ),
      ));
    }

    for (var val in widget.otherFilters) {
      if (!val.alwaysShow) {
        list.add(animateSize(getFilter(val.name, val.options, val.onChange)));
        list.add(animateSize(
          const SizedBox(
            height: 10,
          ),
        ));
        continue;
      }

      list.add(getFilter(val.name, val.options, val.onChange));
      list.add(
        const SizedBox(
          height: 10,
        ),
      );
    }

    return list;
  }

  Widget getFilter(String key, List<String> values, Function(String) onChange) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        animateSize(Text(key,
            style: const TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.w700))),
        animateSize(
          const SizedBox(
            height: 15,
          ),
        ),
        HorizontalSelectMenu(options: values, onPressed: onChange)
      ],
    );
  }

  Widget getDateFilter() {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(
        children: [
          Text(AppLocalizations.of(context)!.date,
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.w700)),
          IconButton(
              onPressed: () {
                setState(() {
                  ascendant = !ascendant;

                });

                ascendant
                    ? widget.onOrderChange(Order.ascendant)
                    : widget.onOrderChange(Order.descendant);
              },
              icon: Icon(
                ascendant ? Icons.arrow_circle_down : Icons.arrow_circle_up,
                color: Colors.white,
              ))
        ],
      ),
      const SizedBox(
        height: 5,
      ),
      ascendant ? ascendantDates() : descendantDates()
    ]);
  }

  Widget ascendantDates() {
    return Column(
      children: [
        Row(
          children: [
            Text(
              "${AppLocalizations.of(context)!.from}:",
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 15,
                  fontWeight: FontWeight.w700),
            ),
            const SizedBox(
              width: 10,
            ),
            Text(
              DateFormat((context
                              .watch<LanguageChangeProvider>()
                              .getCurrentLocaleCode() ==
                          "en")
                      ? 'yyyy-MM-dd'
                      : 'dd-MM-yyyy')
                  .format(oldestDate),
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 15,
                  fontWeight: FontWeight.w700),
            ),
            IconButton(
                onPressed: () => _selectDateFrom(),
                icon: const Icon(Icons.calendar_month, color: Colors.white))
          ],
        ),
        Row(
          children: [
            Text("${AppLocalizations.of(context)!.to}:",
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w700)),
            const SizedBox(
              width: 10,
            ),
            Text(
                DateFormat((context
                                .watch<LanguageChangeProvider>()
                                .getCurrentLocaleCode() ==
                            "en")
                        ? 'yyyy-MM-dd'
                        : 'dd-MM-yyyy')
                    .format(mostRecentDate),
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w700)),
            IconButton(
                onPressed: () => _selectDateUntil(),
                icon: const Icon(Icons.calendar_month, color: Colors.white)),
          ],
        )
      ],
    );
  }

  Widget descendantDates() {
    return Column(
      children: [
        Row(
          children: [
            Text(
              "${AppLocalizations.of(context)!.from}:",
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 15,
                  fontWeight: FontWeight.w700),
            ),
            const SizedBox(
              width: 10,
            ),
            Text(
                DateFormat((context
                                .watch<LanguageChangeProvider>()
                                .getCurrentLocaleCode() ==
                            "en")
                        ? 'yyyy-MM-dd'
                        : 'dd-MM-yyyy')
                    .format(mostRecentDate),
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w700)),
            IconButton(
                onPressed: () => _selectDateUntil(),
                icon: const Icon(Icons.calendar_month, color: Colors.white)),
          ],
        ),
        Row(
          children: [
            Text("${AppLocalizations.of(context)!.to}:",
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w700)),
            const SizedBox(
              width: 10,
            ),
            Text(
              DateFormat((context
                              .watch<LanguageChangeProvider>()
                              .getCurrentLocaleCode() ==
                          "en")
                      ? 'yyyy-MM-dd'
                      : 'dd-MM-yyyy')
                  .format(oldestDate),
              style: const TextStyle(
                  color: Colors.white,
                  fontSize: 15,
                  fontWeight: FontWeight.w700),
            ),
            IconButton(
                onPressed: () => _selectDateFrom(),
                icon: const Icon(Icons.calendar_month, color: Colors.white))
          ],
        )
      ],
    );
  }
}
