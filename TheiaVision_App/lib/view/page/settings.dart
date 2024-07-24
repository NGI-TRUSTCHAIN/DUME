import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:theia/controller/solid-protocol/request_service.dart';
import 'package:theia/model/button_info.dart';
import 'package:theia/utils.dart';
import 'package:theia/view/component/custom_form_field.dart';
import 'package:theia/view/component/custom_password_form_field.dart';
import 'package:theia/view/component/solid/account_popup.dart';
import 'package:theia/view/component/solid/info_popup.dart';

import '../../constants.dart';
import '../../controller/provider/language_provider.dart';
import '../../controller/provider/user_provider.dart';
import '../../model/connection.dart';
import '../component/bottom_bar.dart';
import '../component/top_bar.dart';

class SettingsProfile extends StatefulWidget {
  const SettingsProfile({super.key});

  @override
  State<StatefulWidget> createState() {
    return _SettingsProfileState();
  }
}

class _SettingsProfileState extends State<SettingsProfile> {
  late Connection connection;
  late TextEditingController _passwordController;

  static final solidRequestService = SolidService();

  @override
  void initState() {
    connection = Provider.of<UserProvider>(context, listen: false).connection;

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return CustomBottomNavBar(body: getBody(), currentIndex: -1);
  }

  Widget getBody() {
    return Container(
      decoration: const BoxDecoration(color: theiaAppBarGray),
      child: Column(
        children: [
          TopBar(
            text: AppLocalizations.of(context)!.settings,
          ),
          Expanded(
            child: SingleChildScrollView(
              child: Column(children: [
                getUploadPrefs(),
                changeLanguage(),
                changeAPIProtocol()
              ]),
            ),
          )
        ],
      ),
    );
  }

  Widget getUploadPrefs() {
    return Container(
      width: MediaQuery.of(context).size.width,
      margin: const EdgeInsets.all(20),
      child: Container(
        width: MediaQuery.of(context).size.width - 40,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(30),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(
            AppLocalizations.of(context)!.upload_settings,
            style: const TextStyle(
                color: theiaDarkPurple,
                fontSize: 18,
                fontWeight: FontWeight.bold),
          ),
          RadioListTile<Connection>(
            value: Connection.wifi,
            groupValue: connection,
            onChanged: (Connection? value) {
              setState(() {
                connection = value!;
                Provider.of<UserProvider>(context, listen: false).connection =
                    value;
                uploadPreference(value);
              });
            },
            title: Text(AppLocalizations.of(context)!.wifi),
          ),
          RadioListTile<Connection>(
            value: Connection.wifiData,
            groupValue: connection,
            onChanged: (Connection? value) {
              setState(() {
                connection = value!;
                Provider.of<UserProvider>(context, listen: false).connection =
                    value;
                uploadPreference(value);
              });
            },
            title: Text(AppLocalizations.of(context)!.wifi_data),
          )
        ]),
      ),
    );
  }

  Widget changeLanguage() {
    return Container(
      width: MediaQuery.of(context).size.width,
      margin: const EdgeInsets.all(20),
      child: Container(
        width: MediaQuery.of(context).size.width - 40,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(30),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(
            AppLocalizations.of(context)!.language,
            style: const TextStyle(
                color: theiaDarkPurple,
                fontSize: 18,
                fontWeight: FontWeight.bold),
          ),
          DropdownMenu(
            dropdownMenuEntries: [
              DropdownMenuEntry(
                value: 'en',
                label: AppLocalizations.of(context)!.english,
              ),
              DropdownMenuEntry(
                  value: 'pt', label: AppLocalizations.of(context)!.portuguese)
            ],
            onSelected: (value) => context
                .read<LanguageChangeProvider>()
                .changeLocale(value!, context),
            initialSelection:
                context.watch<LanguageChangeProvider>().getCurrentLocaleCode(),
            textStyle: const TextStyle(fontSize: 18),
            menuStyle: MenuStyle(
              surfaceTintColor:
                  WidgetStateProperty.all<Color?>(Colors.transparent),
            ),
          ),
        ]),
      ),
    );
  }

  Widget changeAPIProtocol() {
    return Container(
      width: MediaQuery.of(context).size.width,
      margin: const EdgeInsets.all(20),
      child: Container(
        width: MediaQuery.of(context).size.width - 40,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(30),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(
            AppLocalizations.of(context)!.api_change_settings,
            style: const TextStyle(
                color: theiaDarkPurple,
                fontSize: 18,
                fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: showSolidAccountPopup,
              style: ButtonStyle(
                  backgroundColor: WidgetStateProperty.all(theiaDarkPurple),
                  surfaceTintColor: WidgetStateProperty.all(theiaDarkPurple),
                  foregroundColor: WidgetStateProperty.all(Colors.white)),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.storage, size: 20), // Left icon
                  const SizedBox(width: 8), // Spacing between icon and text
                  Text(
                    AppLocalizations.of(context)!.solid_api.toUpperCase(),
                    style: const TextStyle(
                        fontSize: 14, fontWeight: FontWeight.w700),
                  ),
                  const Spacer(), // Spacing between text and icon
                  GestureDetector(
                    onTap: () {
                      showSolidInfo(AppLocalizations.of(context)!.solid_name,
                          AppLocalizations.of(context)!.solid_popup_info);
                    },
                    child: const Icon(Icons.info, size: 20), // Right icon
                  ),
                  // const Icon(Icons.info, size: 20), // Right icon
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                apiPreference("theia");
              },
              style: ButtonStyle(
                  backgroundColor: WidgetStateProperty.all(theiaBrightPurple),
                  surfaceTintColor: WidgetStateProperty.all(theiaBrightPurple),
                  foregroundColor: WidgetStateProperty.all(Colors.white)),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.language, size: 20), // Left icon
                  const SizedBox(width: 8), // Spacing between icon and text
                  Text(
                    AppLocalizations.of(context)!.theia_api.toUpperCase(),
                    style: const TextStyle(
                        fontSize: 14, fontWeight: FontWeight.w700),
                  ),
                  const Spacer(), // Spacing between text and icon
                  GestureDetector(
                    onTap: () {
                      showSolidInfo(
                          AppLocalizations.of(context)!.theia_api_name,
                          AppLocalizations.of(context)!.theia_popup_info);
                    },
                    child: const Icon(Icons.info, size: 20), // Right icon
                  ),
                ],
              ),
            ),
          ),
        ]),
      ),
    );
  }

  void showSolidInfo(String title, String text) {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return InfoPopup(
              title: title,
              text: text,
              buttonClose: ButtonInfo(
                  AppLocalizations.of(context)!.close_popup, dismissWindow));
        },
        barrierDismissible: false);
  }

  void showSolidAccountPopup() {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return AccountPopup(
              title: AppLocalizations.of(context)!.pod_account_popup,
              text: AppLocalizations.of(context)!.pod_account_popup_text,
              buttonExistentAccount: ButtonInfo(
                  AppLocalizations.of(context)!.add_pod_account,
                  showAddFormPopUp),
              buttonCreateAccount: ButtonInfo(
                  AppLocalizations.of(context)!.create_pod_account,
                  showCreateFormPopUp));
        },
        barrierDismissible: false);
  }

  final _formKey = GlobalKey<FormState>();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController password = TextEditingController();
  final TextEditingController usernameController = TextEditingController();

  void showCreateFormPopUp() {
    Navigator.of(context).pop(); // Close the previous dialog first
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
            child: Container(
                decoration: getBackgroundImage(),
                padding: const EdgeInsets.all(20),
                child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        AppLocalizations.of(context)!
                            .create_pod_form
                            .toUpperCase(),
                        style: const TextStyle(
                          color: Colors.purple,
                          fontWeight: FontWeight.w700,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 20),
                      Form(
                        key: _formKey,
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            const SizedBox(height: 15),
                            CustomFormField(
                              text:
                                  AppLocalizations.of(context)!.name_form_label,
                              keyboardType: TextInputType.text,
                              mandatory: true,
                              controller: nameController,
                            ),
                            CustomFormField(
                              text: AppLocalizations.of(context)!
                                  .solid_pod_username,
                              keyboardType: TextInputType.text,
                              mandatory: true,
                              controller: usernameController,
                            ),
                            CustomFormField(
                              text: AppLocalizations.of(context)!
                                  .email_form_label,
                              keyboardType: TextInputType.emailAddress,
                              mandatory: true,
                              controller: emailController,
                            ),
                            CustomPasswordFormField(
                              text: AppLocalizations.of(context)!
                                  .password_form_label,
                              mandatory: true,
                              controller: password,
                            ),
                            Text(
                              AppLocalizations.of(context)!.mandatory_fields,
                              style: const TextStyle(
                                color: Colors.purple, // Update to your color
                                fontSize: 12,
                                fontWeight: FontWeight.w300,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 40),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          ElevatedButton(
                            onPressed: dismissWindow,
                            style: ButtonStyle(
                              backgroundColor:
                                  WidgetStateProperty.all(Colors.white),
                              foregroundColor:
                                  WidgetStateProperty.all(theiaBrightPurple),
                              side: WidgetStateProperty.all(
                                const BorderSide(
                                    color: theiaBrightPurple, width: 2),
                              ),
                            ),
                            child: Text(
                              AppLocalizations.of(context)!
                                  .close_popup
                                  .toUpperCase(),
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                          ElevatedButton(
                            onPressed: () async {
                              // solidRequestService.uploadVideoParams();
                              if (validateCreateForm()) {
                                final Map<String, String> message =
                                    await solidRequestService.createAccount(
                                        usernameController.text,
                                        password.text,
                                        emailController.text,
                                        nameController.text);

                                if (message['message'] == 'success') {
                                  showCustomToast(AppLocalizations.of(context)!
                                      .account_created_success);
                                  await solidRequestService.signIn(
                                      usernameController.text, password.text);
                                  apiPreference("solid");

                                  dismissWindow();
                                }
                              }
                            },
                            style: ButtonStyle(
                                backgroundColor:
                                    WidgetStateProperty.all(theiaBrightPurple),
                                surfaceTintColor:
                                    WidgetStateProperty.all(theiaBrightPurple),
                                foregroundColor:
                                    WidgetStateProperty.all(Colors.white)),
                            child: Text(
                              AppLocalizations.of(context)!
                                  .create_pod_account
                                  .toUpperCase(),
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ])));
      },
      barrierDismissible: false,
    );
  }

  void showAddFormPopUp() {
    Navigator.of(context).pop(); // Close the previous dialog first
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
            child: Container(
                decoration: getBackgroundImage(),
                padding: const EdgeInsets.all(20),
                child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        AppLocalizations.of(context)!
                            .add_pod_form
                            .toUpperCase(),
                        style: const TextStyle(
                          color: Colors.purple,
                          fontWeight: FontWeight.w700,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 20),
                      Form(
                        key: _formKey,
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            const SizedBox(height: 15),
                            CustomFormField(
                              text: AppLocalizations.of(context)!
                                  .solid_pod_username,
                              keyboardType: TextInputType.text,
                              mandatory: true,
                              controller: usernameController,
                            ),
                            CustomPasswordFormField(
                              text: AppLocalizations.of(context)!
                                  .password_form_label,
                              mandatory: true,
                              controller: password,
                            ),
                            Text(
                              AppLocalizations.of(context)!.mandatory_fields,
                              style: const TextStyle(
                                color: Colors.purple, // Update to your color
                                fontSize: 12,
                                fontWeight: FontWeight.w300,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 40),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          ElevatedButton(
                            onPressed: dismissWindow,
                            style: ButtonStyle(
                              backgroundColor:
                                  WidgetStateProperty.all(Colors.white),
                              foregroundColor:
                                  WidgetStateProperty.all(theiaBrightPurple),
                              side: WidgetStateProperty.all(
                                const BorderSide(
                                    color: theiaBrightPurple, width: 2),
                              ),
                            ),
                            child: Text(
                              AppLocalizations.of(context)!
                                  .close_popup
                                  .toUpperCase(),
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                          ElevatedButton(
                            onPressed: () async {
                              if (validateAddForm()) {
                                log('here');
                                final Map<String, String> message =
                                    await solidRequestService.signIn(
                                        usernameController.text, password.text);

                                if (message['message'] == 'success') {
                                  showCustomToast(AppLocalizations.of(context)!
                                      .login_successful_toast);
                                  apiPreference("solid");

                                  dismissWindow();
                                }
                                // var response = await http.post(
                                //     Uri.https('dume-arditi.com', '/jwt'),
                                //     body: {
                                //       'username': usernameController.text,
                                //       'password': password.text,
                                //       'webId':
                                //           'https://${usernameController.text}.'
                                //               'dume-arditi.com/profile/card#me'
                                //     },
                                //     headers: {
                                //       'Content-Type':
                                //           'application/x-www-form-urlencoded'
                                //     });
                                // log('Response status: ${response.statusCode}');
                                // log('Response body: ${response.body}');
                                // if (response.statusCode == 200) {
                                //   showCustomToast(AppLocalizations.of(context)!
                                //       .login_successful_toast);
                                //   dismissWindow();
                                //   // Parse the JSON response
                                //   final Map<String, dynamic> responseData =
                                //       jsonDecode(response.body);
                                //   final String token = responseData['token'];
                                //
                                //   log('Extracted token: $token');
                                //
                                //   solidPreference(usernameController.text, password.text, token, 'https://${usernameController.text}.'
                                //       'dume-arditi.com/profile/card#me');
                                // }
                              }
                            },
                            style: ButtonStyle(
                                backgroundColor:
                                    WidgetStateProperty.all(theiaBrightPurple),
                                surfaceTintColor:
                                    WidgetStateProperty.all(theiaBrightPurple),
                                foregroundColor:
                                    WidgetStateProperty.all(Colors.white)),
                            child: Text(
                              AppLocalizations.of(context)!
                                  .add_pod_account
                                  .toUpperCase(),
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ])));
      },
      barrierDismissible: false,
    );
  }

  bool validateCreateForm() {
    if (usernameController.text.isEmpty ||
        password.text.isEmpty ||
        emailController.text.isEmpty ||
        nameController.text.isEmpty) {
      showCustomToast(
          AppLocalizations.of(context)!.all_fields_except_name_must_be_filled);
      return false;
    }

    if (!passwordRegExp.hasMatch(password.text)) {
      showCustomToast(AppLocalizations.of(context)!.password_requirements);
      return false;
    }

    if (!emailRegex.hasMatch(emailController.text)) {
      showCustomToast(AppLocalizations.of(context)!.not_a_valid_email);
      return false;
    }

    return true;
  }

  bool validateAddForm() {
    if (usernameController.text.isEmpty || password.text.isEmpty) {
      showCustomToast(
          AppLocalizations.of(context)!.all_fields_except_name_must_be_filled);
      return false;
    }

    if (!passwordRegExp.hasMatch(password.text)) {
      showCustomToast(AppLocalizations.of(context)!.password_requirements);
      return false;
    }

    return true;
  }

  void dismissWindow() {
    Navigator.of(context).pop();
  }

  Future<void> uploadPreference(Connection newConnection) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString("upload_pref", connection.toString());
  }

  Future<void> apiPreference(String api) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString("api_pref", api);
    log("The api choice is: $api");
  }

  Future<void> solidPreference(String solidUsername, String solidPassword,
      String solidToken, String solidWebId) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString("solidUsername", solidUsername);
    prefs.setString("solidPassword", solidPassword);
    prefs.setString("solidToken", solidToken);
    prefs.setString("solidWebId", solidWebId);

    log("Shared Preferences: $prefs");
  }
}
