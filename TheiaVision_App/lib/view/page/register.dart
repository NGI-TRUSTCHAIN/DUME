import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:theia/controller/provider/user_provider.dart';
import 'package:theia/model/loading_state.dart';
import 'package:theia/view/component/custom_password_form_field.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:theia/constants.dart';

import '../../utils.dart';
import '../component/custom_form_field.dart';
import '../component/top_bar_login.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<StatefulWidget> createState() {
    return _RegisterState();
  }
}

class _RegisterState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController password = TextEditingController();
  final TextEditingController confPassword = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        height: MediaQuery.of(context).size.height,
        width: MediaQuery.of(context).size.width,
        decoration: getBackgroundImage(),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(children: [
              const TopBarLogin(backButton: true, backPage: "/login"),
              getForm()
            ]),
            getButtons()
          ],
        ),
      ),
    );
  }

  Widget getWelcomeText() {
    return Text(
      AppLocalizations.of(context)!.create_account_title,
      style: const TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.w700,
          letterSpacing: 4),
      textAlign: TextAlign.center,
    );
  }

  Widget getForm() {
    return Container(
      margin: const EdgeInsets.all(55),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            getLogo(context),
            getWelcomeText(),
            const SizedBox(height: 15),
            CustomFormField(
              text: AppLocalizations.of(context)!.email_form_label,
              keyboardType: TextInputType.emailAddress,
              mandatory: true,
              controller: emailController,
            ),
            CustomFormField(
              text: AppLocalizations.of(context)!.name_form_label,
              keyboardType: TextInputType.text,
              controller: nameController,
            ),
            CustomPasswordFormField(
              text: AppLocalizations.of(context)!.password_form_label,
              mandatory: true,
              controller: password,
            ),
            CustomPasswordFormField(
              text: AppLocalizations.of(context)!.confirm_password_form_label,
              mandatory: true,
              controller: confPassword,
            ),
            Text(
              AppLocalizations.of(context)!.mandatory_fields,
              style: const TextStyle(
                  color: theiaBrightPurple,
                  fontSize: 12,
                  fontWeight: FontWeight.w300),
            )
          ],
        ),
      ),
    );
  }

  bool validateForm() {
    if (confPassword.text.isEmpty ||
        password.text.isEmpty ||
        emailController.text.isEmpty) {
      showCustomToast(AppLocalizations.of(context)!.all_fields_except_name_must_be_filled);
      return false;
    }

    if (confPassword.text != password.text) {
      showCustomToast(AppLocalizations.of(context)!.password_does_not_match);
      return false;
    }

    if (!passwordRegExp.hasMatch(password.text)) {
      showCustomToast(
          AppLocalizations.of(context)!.password_requirements);
      return false;
    }

    if(!emailRegex.hasMatch(emailController.text)){
      showCustomToast(
          AppLocalizations.of(context)!.not_a_valid_email);
      return false;
    }

    return true;
  }

  Widget getButtons() {
    return Container(
      margin: const EdgeInsets.all(25),
      child: Column(
        children: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                if (Provider.of<UserProvider>(context, listen: false).state ==
                    LoadingState.loading) {
                  return;
                }

                if (validateForm()) {
                  Provider.of<UserProvider>(context, listen: false)
                      .createAccount(emailController.text, password.text, nameController.text.isEmpty ? null : nameController.text, context)
                      .then((value) => {
                            if (Provider.of<UserProvider>(context,
                                        listen: false)
                                    .state ==
                                LoadingState.error)
                              {
                                showCustomToast(Provider.of<UserProvider>(
                                        context,
                                        listen: false)
                                    .errorMessage)
                              }
                            else
                              {
                                Navigator.of(context).pushNamed("/login"),
                                showCustomToast(AppLocalizations.of(context)!.account_created_success)
                              }
                          });
                }
              },
              style: ButtonStyle(
                backgroundColor:
                    WidgetStateProperty.all<Color>(theiaBrightPurple),
                foregroundColor: WidgetStateProperty.all<Color>(Colors.white),
              ),
              child: context.watch<UserProvider>().state == LoadingState.loading
                  ? const SizedBox(
                      height: 18,
                      width: 18,
                      child: CircularProgressIndicator(
                        color: Colors.white,
                      ),
                    )
                  : Text(
                      AppLocalizations.of(context)!.register_button,
                      style: const TextStyle(
                          fontSize: 14, fontWeight: FontWeight.w700),
                    ),
            ),
          ),
          TextButton(
              onPressed: () {
                Navigator.of(context).pushNamed('/login');
              },
              child: Text(AppLocalizations.of(context)!.already_have_account)),
        ],
      ),
    );
  }
}
