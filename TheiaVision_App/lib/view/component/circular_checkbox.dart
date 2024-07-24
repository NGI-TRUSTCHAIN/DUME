import 'package:flutter/material.dart';
import 'package:theia/constants.dart';

class CircularCheckbox extends StatefulWidget {
  final bool value;
  final ValueChanged<bool>? onChanged;

  const CircularCheckbox({
    super.key,
    required this.value,
    this.onChanged,
  });

  @override
  CircularCheckboxState createState() => CircularCheckboxState();
}

class CircularCheckboxState extends State<CircularCheckbox> {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        if (widget.onChanged != null) {
          widget.onChanged!(!widget.value);
        }
      },
      child: Container(
        width: 30,
        height: 30,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: widget.value
                ? theiaBrightPurple
                : theiaBrightPurple.withOpacity(0.5),
            width: 3,
          ),
          color: widget.value ? theiaBrightPurple : Colors.transparent,
        ),
        child: widget.value
            ? const Icon(
                Icons.check,
                size: 20,
                color: Colors.white,
              )
            : null,
      ),
    );
  }
}
