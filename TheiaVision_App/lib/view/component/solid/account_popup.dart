import 'package:flutter/material.dart';
import 'package:theia/constants.dart';
import 'package:theia/model/button_info.dart';

class AccountPopup extends StatelessWidget {
  const AccountPopup({
    super.key,
    required this.title,
    required this.text,
    this.buttonExistentAccount,
    this.buttonCreateAccount,
  });

  final String title;
  final String text;
  final ButtonInfo? buttonExistentAccount;
  final ButtonInfo? buttonCreateAccount;

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
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              title.toUpperCase(),
                              style: const TextStyle(
                                color: Colors.purple, // Change to your color
                                fontWeight: FontWeight.w700,
                                fontSize: 18,
                              ),
                            ),
                          ),
                          GestureDetector(
                            onTap: () {
                              Navigator.of(context).pop();
                            },
                            child: const Icon(Icons.close, color: Colors.grey),
                          ),
                        ],
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

                      if (buttonExistentAccount != null)
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: buttonExistentAccount!.onPressed,
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
                            child: Text(buttonExistentAccount!.text.toUpperCase()),
                          ),
                        ),
                      if (buttonExistentAccount != null) const SizedBox(height: 10),
                      if (buttonCreateAccount != null)
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: buttonCreateAccount!.onPressed,
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
                            child: Text(buttonCreateAccount!.text.toUpperCase()),
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
