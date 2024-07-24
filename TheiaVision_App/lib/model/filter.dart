
class Filter{


  final String name;
  final List<String> options;
  final bool alwaysShow;
  final Function(String) onChange;

  Filter(this.name, this.options, this.alwaysShow, this.onChange);
}

