import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:provider/provider.dart';
import 'package:theia/constants.dart';
import 'package:theia/controller/provider/user_provider.dart';

import '../../model/loading_state.dart';
import '../../utils.dart';
import '../component/custom_form_field.dart';
import '../component/top_bar_login.dart';

class ForgotPasswordEmail extends StatefulWidget {
  const ForgotPasswordEmail({super.key});

  @override
  State<StatefulWidget> createState() {
    return _ForgotPasswordEmailState();
  }
}

class _ForgotPasswordEmailState extends State<ForgotPasswordEmail> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController emailController = TextEditingController();

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
                backPage: "/login",
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
      AppLocalizations.of(context)!.recover_pass.toUpperCase(),
      textAlign: TextAlign.center,
      style: const TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.w700,
          letterSpacing: 4),
    );
  }

  Widget getForgotPasswordButton() {
    return TextButton(
        onPressed: () {},
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
            const SizedBox(height: 50),
            getWelcomeText(),
            const SizedBox(height: 50),
            CustomFormField(
              text: AppLocalizations.of(context)!.email_form_label,
              keyboardType: TextInputType.emailAddress,
              controller: emailController,
            ),
          ],
        ),
      ),
    );
  }

  bool validateForm() {
    if (emailController.text.isEmpty) {
      showCustomToast(AppLocalizations.of(context)!.all_fields_must_be_filled);
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
                  if (!validateForm()) {
                    return;
                  }
                  if (Provider.of<UserProvider>(context, listen: false).state ==
                      LoadingState.loading) {
                    return;
                  }
                  if (validateForm()) {
                    Provider.of<UserProvider>(context, listen: false)
                        .forgotPassword(emailController.text, context)
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
                                  showCustomToast(
                                      "An email was sent to reset the current password"),
                                  Navigator.of(context).pushNamed("/login")
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
                            AppLocalizations.of(context)!.confirm.toUpperCase(),
                            style: const TextStyle(
                                fontSize: 14, fontWeight: FontWeight.w700),
                          )),
          ),
        ],
      ),
    );
  }
}
