import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:provider/provider.dart';
import 'package:theia/constants.dart';
import 'package:theia/view/component/custom_password_form_field.dart';

import '../../controller/provider/user_provider.dart';
import '../../model/loading_state.dart';
import '../../utils.dart';
import '../component/custom_form_field.dart';
import '../component/top_bar_login.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<StatefulWidget> createState() {
    return _LoginState();
  }
}

class _LoginState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        height: double.infinity,
        width: MediaQuery.of(context).size.width,
        decoration: getBackgroundImage(),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(children: [
              const TopBarLogin(
                backButton: true,
                backPage: "/language",
              ),
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
      AppLocalizations.of(context)!.welcome_text,
      style: const TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.w700,
          letterSpacing: 4),
    );
  }

  bool validateForm() {
    if (passwordController.text.isEmpty || emailController.text.isEmpty) {
      showCustomToast(AppLocalizations.of(context)!.all_fields_must_be_filled);
      return false;
    }
    if(!emailRegex.hasMatch(emailController.text)){
      showCustomToast(
          AppLocalizations.of(context)!.not_a_valid_email);
      return false;
    }


    return true;
  }

  Widget getForgotPasswordButton() {
    return TextButton(
        onPressed: () {
          Navigator.of(context).pushNamed("/forgotPassEmail");
        },
        child: Text(AppLocalizations.of(context)!.forgot_password));
  }

  Widget getForm() {
    return Container(
      margin: const EdgeInsets.all(55),
      child: Form(
        key: _formKey,
        child: Column(
          children: [
            getLogo(context),
            getWelcomeText(),
            const SizedBox(height: 20),
            CustomFormField(
              text: AppLocalizations.of(context)!.email_form_label,
              keyboardType: TextInputType.emailAddress,
              controller: emailController,
            ),
            const SizedBox(height: 15),
            CustomPasswordFormField(
              text: AppLocalizations.of(context)!.password_form_label,
              controller: passwordController,
            ),
            getForgotPasswordButton()
          ],
        ),
      ),
    );
  }

  Widget getButtons() {
    return Container(
      margin: MediaQuery.of(context).viewInsets.bottom == 0
          ? const EdgeInsets.all(25)
          : const EdgeInsets.fromLTRB(25, 0, 25, 25),
      child: Column(
        children: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
                style: ButtonStyle(
                    backgroundColor: WidgetStateProperty.all(Colors.white),
                    surfaceTintColor: WidgetStateProperty.all(Colors.white),
                    foregroundColor:
                    WidgetStateProperty.all(theiaBrightPurple)),

                onPressed: () {
                  if (Provider.of<UserProvider>(context, listen: false).state ==
                      LoadingState.loading) {
                    return;
                  }
                  if (validateForm()) {
                    Provider.of<UserProvider>(context, listen: false)
                        .login(emailController.text, passwordController.text,context)
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
                                  Navigator.of(context).pushNamed("/"),
                                  showCustomToast(AppLocalizations.of(context)!.login_successful_toast)
                                }
                            });
                  }
                },
                child:
                    context.watch<UserProvider>().state == LoadingState.loading
                        ? const SizedBox(
                          height: 18,
                          width: 18,
                          child: CircularProgressIndicator(
                              color: theiaBrightPurple,
                            ),
                        )
                        : Text(
                            AppLocalizations.of(context)!.login_button,
                            style: const TextStyle(
                                fontSize: 14, fontWeight: FontWeight.w700),
                          )),
          ),
          TextButton(
              onPressed: () {
                Navigator.of(context).pushNamed("/register");
              },
              child: Text(AppLocalizations.of(context)!.no_account)),
        ],
      ),
    );
  }
}
