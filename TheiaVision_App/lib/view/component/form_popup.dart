import 'package:flutter/material.dart';
import 'package:theia/constants.dart';
import '../../model/button_info.dart';

class FormPopup extends StatelessWidget {
  const FormPopup({
    super.key,
    required this.title,
    required this.text,
    this.buttonAccept,
    this.buttonCancel,
    required this.form, this.isLoading = false,
  });

  final String title;
  final String text;
  final Form form;
  final ButtonInfo? buttonAccept;
  final ButtonInfo? buttonCancel;
  final bool isLoading;

  @override
  Widget build(BuildContext context) {
    return Builder(
      builder: (BuildContext context) {
        return AnimatedPadding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
          ),
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
          child: Center(
            child: Material(
              color: Colors.transparent,
              child: Theme(
                data: customTheme,
                child: Container(
                  padding: const EdgeInsets.all(20),
                  width: MediaQuery.of(context).size.width - 60,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title.toUpperCase(),
                        style: const TextStyle(
                          color: theiaBrightPurple,
                          fontWeight: FontWeight.w700,
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Container(
                        width: double.infinity,
                        height: 2,
                        color: theiaAppBarGray,
                      ),
                      const SizedBox(height: 10),
                      Text(
                        text,
                        textAlign: TextAlign.justify,
                        style: const TextStyle(
                          color: Colors.black,
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 40),
                      form,
                      const SizedBox(height: 40),

                      if (isLoading) const Center(child: CircularProgressIndicator()),

                      if (buttonAccept != null && !isLoading)
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: buttonAccept!.onPressed,
                            style: ButtonStyle(
                              textStyle: WidgetStateProperty.all(
                                const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              backgroundColor: WidgetStateProperty.all(Colors.white),
                              foregroundColor: WidgetStateProperty.all(theiaBrightPurple),
                              side: WidgetStateProperty.all(
                                const BorderSide(color: theiaBrightPurple, width: 2),
                              ),
                            ),
                            child: Text(buttonAccept!.text.toUpperCase()),
                          ),
                        ),
                      if (buttonAccept != null && !isLoading) const SizedBox(height: 10),
                      if (buttonCancel != null && !isLoading)
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: buttonCancel!.onPressed,
                            style: ButtonStyle(
                              textStyle: WidgetStateProperty.all(
                                const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              backgroundColor: WidgetStateProperty.all(theiaBrightPurple),
                              foregroundColor: WidgetStateProperty.all(Colors.white),
                            ),
                            child: Text(buttonCancel!.text.toUpperCase()),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
