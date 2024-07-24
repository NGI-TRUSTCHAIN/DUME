import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_svg/svg.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:theia/model/loading_state.dart';
import 'package:theia/view/component/form_popup.dart';

import '../../controller/provider/user_provider.dart';
import '../../model/button_info.dart';
import '../../utils.dart';
import '../component/bottom_bar.dart';
import '../component/custom_password_form_field.dart';
import '../component/warning_popup.dart';
import '../component/title_list.dart';
import '../component/top_bar.dart';
import '../../constants.dart';

class UserProfile extends StatefulWidget {
  const UserProfile({super.key});

  @override
  State<StatefulWidget> createState() {
    return _UserProfileState();
  }
}

class _UserProfileState extends State<UserProfile> {
  final ImagePicker picker = ImagePicker();
  bool editingName = false;
  bool editingEmail = false;
  bool editingPicture = false;
  String? newImagePath;
  late TextEditingController _emailController;
  late TextEditingController _nameController;
  late TextEditingController _passwordController;
  Uint8List? newImage;

  Key imageKey = UniqueKey();

  late Future<void> haveInfo;

  @override
  void initState() {
    super.initState();

    _emailController = TextEditingController(
        text: Provider.of<UserProvider>(context, listen: false).email ?? "");
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _nameController = TextEditingController(
            text: Provider.of<UserProvider>(context, listen: false).name ??
                AppLocalizations.of(context)!.user);
      }
    });

    haveInfo = Provider.of<UserProvider>(context, listen: false)
        .getProfileInfo(context);
  }

  @override
  Widget build(BuildContext context) {
    return CustomBottomNavBar(body: getBody(), currentIndex: -1);
  }

  Widget getBody() {
    return FutureBuilder<void>(
      future: haveInfo,
      builder: (BuildContext context, AsyncSnapshot<void> snapshot) {
        switch (snapshot.connectionState) {
          case ConnectionState.waiting:
            return Container(
              decoration: const BoxDecoration(color: theiaAppBarGray),
              child: const Center(child: CircularProgressIndicator()),
            );
          default:
            return buildUserProfile();
        }
      },
    );
  }

  Widget buildUserProfile() {
    return Container(
      decoration: const BoxDecoration(color: theiaAppBarGray),
      child: Column(
        children: [
          TopBar(
            text: AppLocalizations.of(context)!.user,
            isUserPage: true,
          ),
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  // getProfileInfo(),
                  getProfileInfoSolid(), // Moved outside FutureBuilder
                  getContent(),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget getContent() {
    return Container(
      width: MediaQuery.of(context).size.width,
      margin: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          ListTitle(
            cards: [
              Container(
                  padding: const EdgeInsets.all(15),
                  child: Text(
                    AppLocalizations.of(context)!.no_items(
                        AppLocalizations.of(context)!.packages.toLowerCase()),
                    style:
                        const TextStyle(color: theiaAppBarGray, fontSize: 15),
                    textAlign: TextAlign.end,
                  ))
            ],
            title: AppLocalizations.of(context)!.my_packages,
            buttonPath: "/packages",
            separators: true,
          ),
          const SizedBox(
            height: 20,
          ),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
                onPressed: () {
                  showChangePasswordPopUp();
                },
                style: ButtonStyle(
                    backgroundColor: WidgetStateProperty.all(Colors.white),
                    surfaceTintColor: WidgetStateProperty.all(Colors.white),
                    foregroundColor:
                        WidgetStateProperty.all(theiaBrightPurple)),
                child: Text(
                  AppLocalizations.of(context)!.change_password.toUpperCase(),
                  style: const TextStyle(
                      fontSize: 14, fontWeight: FontWeight.w700),
                )),
          ),
          const SizedBox(
            height: 10,
          ),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
                onPressed: () {
                  if (Provider.of<UserProvider>(context, listen: false).state ==
                      LoadingState.loading) {
                    return;
                  }

                  Provider.of<UserProvider>(context, listen: false)
                      .logout()
                      .then(
                          (value) => Navigator.of(context).pushNamed("/login"));
                },
                style: ButtonStyle(
                    backgroundColor: WidgetStateProperty.all(theiaBrightPurple),
                    surfaceTintColor:
                        WidgetStateProperty.all(theiaBrightPurple),
                    foregroundColor: WidgetStateProperty.all(Colors.white)),
                child: (context.watch<UserProvider>().logoutState ==
                        LoadingState.loading)
                    ? const CircularProgressIndicator(
                        color: Colors.white,
                      )
                    : Text(
                        AppLocalizations.of(context)!.logout.toUpperCase(),
                        style: const TextStyle(
                            fontSize: 14, fontWeight: FontWeight.w700),
                      )),
          ),
          const SizedBox(
            height: 10,
          ),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
                onPressed: showDeleteAccountWarning,
                style: ButtonStyle(
                    backgroundColor: WidgetStateProperty.all(theiaDarkPurple),
                    surfaceTintColor: WidgetStateProperty.all(theiaDarkPurple),
                    foregroundColor: WidgetStateProperty.all(Colors.white)),
                child: Text(
                  AppLocalizations.of(context)!.delete_account.toUpperCase(),
                  style: const TextStyle(
                      fontSize: 14, fontWeight: FontWeight.w700),
                )),
          ),
        ],
      ),
    );
  }

  void showDeleteAccountWarning() {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return WarningPopup(
              title: AppLocalizations.of(context)!.delete_account,
              text: AppLocalizations.of(context)!.delete_text,
              buttonAccept:
                  ButtonInfo(AppLocalizations.of(context)!.delete, goToLogin),
              buttonCancel: ButtonInfo(
                  AppLocalizations.of(context)!.cancel, dismissWindow),
              isLoading: context.watch<UserProvider>().deleteAccountState ==
                  LoadingState.loading);
        },
        barrierDismissible: false);
  }

  void showChangePasswordPopUp() {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return FormPopup(
              title: AppLocalizations.of(context)!.change_password,
              text: AppLocalizations.of(context)!.change_password_text,
              form: getChangePasswordForm(),
              buttonAccept: ButtonInfo(
                  AppLocalizations.of(context)!.confirm, changePassword),
              buttonCancel: ButtonInfo(
                  AppLocalizations.of(context)!.cancel, dismissWindow),
              isLoading: context.watch<UserProvider>().changePasswordState ==
                  LoadingState.loading);
        },
        barrierDismissible: false);
  }

  cancelChangePassword() {
    _passwordController.dispose();
    dismissWindow();
  }

  Form getChangePasswordForm() {
    _passwordController = TextEditingController();
    return Form(
        child: Column(
      children: [
        CustomPasswordFormField(
          text: AppLocalizations.of(context)!.password_form_label,
          mandatory: false,
          controller: _passwordController,
          color: theiaDarkPurple,
        ),
      ],
    ));
  }

  changePassword() {
    if (validatePasswordChange()) {
      Provider.of<UserProvider>(context, listen: false)
          .changePassword(_passwordController.text, context)
          .then((value) {
        if (Provider.of<UserProvider>(context, listen: false)
                .changePasswordState ==
            LoadingState.error) {
          showCustomToast(
              Provider.of<UserProvider>(context, listen: false).errorMessage);
        } else {
          Navigator.pop(context);
          showCustomToast(AppLocalizations.of(context)!.email_sent);
        }
      });
    }
  }

  bool validatePasswordChange() {
    if (_passwordController.text.isEmpty) {
      showCustomToast(AppLocalizations.of(context)!.all_fields_must_be_filled);
      return false;
    }

    return true;
  }

  void showChangeEmailWarning() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return WarningPopup(
          title: AppLocalizations.of(context)!.change_email,
          text: AppLocalizations.of(context)!.change_email_text,
          buttonAccept:
              ButtonInfo(AppLocalizations.of(context)!.confirm, changeEmail),
          buttonCancel:
              ButtonInfo(AppLocalizations.of(context)!.cancel, dismissWindow),
        );
      },
    );
  }

  void changeEmail() {
    Navigator.of(context).pop();

    if (_emailController.text.isEmpty) {
      showCustomToast(
          AppLocalizations.of(context)!.email_field_must_not_be_empty);
      return;
    }

    if (_emailController.text.trim() ==
        Provider.of<UserProvider>(context, listen: false).email) {
      showCustomToast(AppLocalizations.of(context)!.new_email_dif_old_email);
      return;
    }

    if (!emailRegex.hasMatch(_emailController.text)) {
      showCustomToast(AppLocalizations.of(context)!.not_a_valid_email);
      return;
    }

    editingEmail = false;

    Provider.of<UserProvider>(context, listen: false)
        .changeEmail(_emailController.text, context)
        .then((value) {
      if (Provider.of<UserProvider>(context, listen: false).editState ==
          LoadingState.finished) {
        Navigator.of(context).pushNamed('/login');
        showCustomToast(AppLocalizations.of(context)!.new_email_received);
      } else {
        showCustomToast(
            Provider.of<UserProvider>(context, listen: false).errorMessage);
      }
    });
  }

  void goToLogin() {
    if (Provider.of<UserProvider>(context, listen: false).state ==
        LoadingState.loading) {
      return;
    }

    Provider.of<UserProvider>(context, listen: false)
        .deleteAccount(context)
        .then((value) {
      if (Provider.of<UserProvider>(context, listen: false)
              .deleteAccountState ==
          LoadingState.finished) {
        showCustomToast(AppLocalizations.of(context)!.account_deleted_success);
        Navigator.of(context).pop();
        Navigator.of(context).pushNamed("/login");
      } else if (Provider.of<UserProvider>(context, listen: false)
              .deleteAccountState ==
          LoadingState.error) {
        showCustomToast(
            Provider.of<UserProvider>(context, listen: false).errorMessage);
      }
    });
  }

  void dismissWindow() {
    Navigator.of(context).pop();
  }

  Widget getName() {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      // Text(
      //   AppLocalizations.of(context)!.name_form_label,
      //   style: const TextStyle(color: Colors.white),
      // ),
      SizedBox(
        height: 50,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            SizedBox(
              width: MediaQuery.of(context).size.width - 100,
              child: Text(
                context.watch<UserProvider>().name ??
                    AppLocalizations.of(context)!.user,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            if (context.watch<UserProvider>().editState == LoadingState.loading)
              getSmallProgressIndicator(),

            if (context.watch<UserProvider>().editState != LoadingState.loading)
              IconButton(
                  icon: const Icon(
                    Icons.edit,
                    color: Colors.white,
                    size: 25,
                  ),
                  onPressed: () {
                    setState(() {
                      editingPicture = false;
                      editingEmail = false;
                      editingName = true;
                    });
                  })
          ],
        ),
      ),
    ]);
  }

  Widget getEditName() {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(
        AppLocalizations.of(context)!.name_form_label,
        style: const TextStyle(color: Colors.white),
      ),
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          SizedBox(
            width: MediaQuery.of(context).size.width - 150,
            child: TextField(
              controller: _nameController,
              style: const TextStyle(color: Colors.white, fontSize: 20),
              decoration: InputDecoration(
                border: InputBorder.none,
                hintText: AppLocalizations.of(context)!.name_form_label,
                hintStyle: const TextStyle(color: Colors.white),
              ),
            ),
        ),
        IconButton(
          icon: const Icon(
            Icons.check,
            color: theiaBrightPurple,
          ),
          onPressed: () {
            setState(() {
              if (_nameController.text.isEmpty) {
                showCustomToast(
                    AppLocalizations.of(context)!.name_cannot_be_empty);
                return;
              }

              if (_nameController.text.trim() ==
                  Provider.of<UserProvider>(context, listen: false).name) {
                showCustomToast(
                    AppLocalizations.of(context)!.new_name_not_equal_to_old);
                return;
              }

                if (_nameController.text.trim() ==
                    Provider.of<UserProvider>(context, listen: false).name) {
                  showCustomToast(
                      AppLocalizations.of(context)!.new_name_not_equal_to_old);
                  return;
                }

                editingName = false;

                Provider.of<UserProvider>(context, listen: false)
                    .changeName(_nameController.text, context)
                    .then((value) {
                  if (Provider.of<UserProvider>(context, listen: false)
                          .editState ==
                      LoadingState.finished) {
                    showCustomToast(
                        AppLocalizations.of(context)!.name_changed_success);
                  } else {
                    showCustomToast(
                        Provider.of<UserProvider>(context, listen: false)
                            .errorMessage);
                  }
                });
              });
            },
    ),
          IconButton(
            icon: const Icon(
              Icons.close,
              color: Colors.white,
            ),
            onPressed: () {
              setState(() {
                _nameController.text =
                    Provider.of<UserProvider>(context, listen: false).name!;
                editingName = false;
              });
            },
          )
        ],
      )
    ]);
  }

  Widget getSmallProgressIndicator() {
    return Container(
        margin: const EdgeInsets.symmetric(horizontal: 8),
        width: 15,
        height: 15,
        child: const CircularProgressIndicator(
          color: theiaBrightPurple,
        ));
  }

  Widget getEmail() {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      // Text(
      //   AppLocalizations.of(context)!.email_form_label,
      //   style: const TextStyle(color: Colors.white),
      // ),
    SizedBox(
    height: 50, child:Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          SizedBox(
            width: MediaQuery.of(context).size.width - 100,
            child: Text(
              context.watch<UserProvider>().email ??
                  AppLocalizations.of(context)!.unknown,
              style: const TextStyle(color: Colors.white, fontSize: 20),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (context.watch<UserProvider>().editState == LoadingState.loading)
            getSmallProgressIndicator(),
          if (context.watch<UserProvider>().editState != LoadingState.loading)
            IconButton(
              color: Colors.white,
              icon: const Icon(
                Icons.edit,
                color: Colors.white,
                size: 25,
              ),
              onPressed: () {
                setState(() {
                  editingPicture = false;
                  editingName = false;
                  editingEmail = true;
                });
              },
            )
        ],
      ),)
    ]);
  }

  Widget getEditEmail() {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(
        AppLocalizations.of(context)!.email_form_label,
        style: const TextStyle(color: Colors.white),
      ),
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          SizedBox(
            width: MediaQuery.of(context).size.width - 150,
            child: TextField(
              controller: _emailController,
              style: const TextStyle(color: Colors.white, fontSize: 20),
              decoration: InputDecoration(
                border: InputBorder.none,
                hintText: AppLocalizations.of(context)!.email_form_label,
                hintStyle: const TextStyle(color: Colors.white),
              ),
            ),
          ),
          IconButton(
            icon: const Icon(
              Icons.check_circle,
              color: Colors.white,
            ),
            onPressed: () {
              showChangeEmailWarning();
            },
          ),
          IconButton(
            icon: const Icon(
              Icons.close,
              color: Colors.white,
            ),
            onPressed: () {
              setState(() {
                _emailController.text =
                    Provider.of<UserProvider>(context, listen: false).email!;
                editingEmail = false;
              });
            },
          )
        ],
      )
    ]);
  }

  Widget getProfileImg() {
    return Stack(children: [
      ClipRRect(
        borderRadius: BorderRadius.circular(100),
        child: context.watch<UserProvider>().image != null
            ? Image.memory(
                context.watch<UserProvider>().image!,
                width: 140,
              )
            : SvgPicture.asset(
                pfPicPlaceHolder,
                width: 140,
              ),
      ),
      const Positioned(
          bottom: -2,
          right: -2,
          child: Icon(
            Icons.circle,
            color: theiaBrightPurple,
            size: 60,
          )),
      (context.watch<UserProvider>().editState != LoadingState.loading)
          ? Positioned(
              bottom: 3,
              right: 3,
              child: IconButton(
                onPressed: () async {
                  setState(() {
                    editingPicture = true;
                    editingEmail = false;
                    editingName = false;
                  });

                  await _cropImage();

                  setState(() {});
                },
                icon: const Icon(
                  Icons.edit,
                  color: Colors.white,
                  size: 30,
                ),
              ))
          : const Positioned(
              bottom: 12,
              right: 12,
              child: SizedBox(
                  height: 30,
                  width: 30,
                  child: CircularProgressIndicator(
                    color: Colors.white,
                  )))
    ]);
  }

  Future<void> _cropImage() async {
    XFile? pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      final croppedFile = await ImageCropper().cropImage(
        sourcePath: pickedFile.path,
        compressFormat: ImageCompressFormat.jpg,
        compressQuality: 100,
        uiSettings: [
          AndroidUiSettings(
              toolbarTitle: 'Cropper',
              toolbarColor: Colors.deepOrange,
              toolbarWidgetColor: Colors.white,
              initAspectRatio: CropAspectRatioPreset.square,
              hideBottomControls: true,
              lockAspectRatio: true),
          IOSUiSettings(
            title: 'Cropper',
            aspectRatioLockEnabled: true,
            aspectRatioPickerButtonHidden: true,
            rectX: 0.0,
            rectY: 0.0,
            rectWidth: 1.0,
            rectHeight: 1.0,
          ),
        ],
      );
      if (croppedFile != null) {
        newImagePath = croppedFile.path;
        newImage = await croppedFile.readAsBytes();
        setState(() {});
      }
    }
  }

  Widget getEditProfileImg() {
    return Stack(children: [
      GestureDetector(
        child: ClipRRect(
            borderRadius: BorderRadius.circular(100),
            child: Stack(children: [
              newImage != null
                  ? Image.memory(
                      newImage!,
                      width: 140,
                    )
                  : context.watch<UserProvider>().image != null
                      ? Image.memory(
                          context.watch<UserProvider>().image!,
                          width: 140,
                        )
                      : SvgPicture.asset(
                          pfPicPlaceHolder,
                          width: 140,
                        ),
              Positioned(
                left: 0,
                top: 0,
                child: Container(
                  width: 140,
                  height: 140,
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.5),
                    borderRadius: BorderRadius.circular(100),
                  ),
                  child: const Icon(
                    Icons.image,
                    color: Colors.white,
                    size: 70,
                  ),
                ),
              ),
            ])),
        onTap: () async {
          await _cropImage();
          setState(() {});
        },
      ),
      const Positioned(
          bottom: -2,
          right: -2,
          child: Icon(
            Icons.circle,
            color: Colors.white,
            size: 60,
          )),
      Positioned(
          bottom: -10,
          right: -10,
          child: IconButton(
              onPressed: () {
                if (newImagePath == null) {
                  setState(() {
                    editingPicture = false;
                  });
                  return;
                }

                setState(() {
                  editingPicture = false;
                });

                Provider.of<UserProvider>(context, listen: false)
                    .changePicture(newImagePath!, context)
                    .then((value) {
                  if (Provider.of<UserProvider>(context, listen: false)
                          .editState ==
                      LoadingState.finished) {
                    showCustomToast(
                        AppLocalizations.of(context)!.picture_changed_success);
                    setState(() {
                      newImagePath = null;
                      newImage = null;
                      imageKey = UniqueKey();
                    });
                  }

                  if (Provider.of<UserProvider>(context, listen: false)
                          .editState ==
                      LoadingState.error) {
                    showCustomToast(
                        Provider.of<UserProvider>(context, listen: false)
                            .errorMessage);
                  }
                });
              },
              icon: const Icon(
                Icons.check_circle,
                color: theiaBrightPurple,
                size: 60,
              )))
    ]);
  }

  Widget getProfileInfo() {
    return Container(
      height: 355,
      padding: const EdgeInsets.all(18),
      decoration: const BoxDecoration(
        color: theiaDarkPurple,
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(50)),
      ),
      child: Form(
        child: Column(crossAxisAlignment: CrossAxisAlignment.center, children: [
          editingPicture ? getEditProfileImg() : getProfileImg(),
          const SizedBox(
            height: 15,
          ),
          SizedBox(height: 70, child: editingName ? getEditName() : getName()),
          const SizedBox(
            height: 10,
          ),
          SizedBox(
              height: 70, child: editingEmail ? getEditEmail() : getEmail()),
        ]),
      ),
    );
  }

  Widget getProfileInfoSolid() {
    return Container(
      height: 340,
      padding: const EdgeInsets.all(18),
      decoration: const BoxDecoration(
        color: theiaDarkPurple,
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(50)),
      ),
      child: FutureBuilder<String?>(
        future: _getMessageFromPreferences(),
        builder: (BuildContext context, AsyncSnapshot<String?> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return const Center(child: Text('Error loading message'));
          } else {
            String message = snapshot.data ?? "You don't have a Solid POD";

            return Form(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  editingPicture ? getEditProfileImg() : getProfileImg(),
                  const SizedBox(height: 15),
                  editingName ? getEditName() : getName(),
                  editingEmail ? getEditEmail() : getEmail(),
                  const SizedBox(height: 15),
                  // Add the static text that changes based on the condition
                  Container(
                    margin: const EdgeInsets.only(left: 8.0), // Add margin to start
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        message,
                        style: const TextStyle(color: Colors.white, fontSize: 14),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }
        },
      ),
    );
  }

  Future<String?> _getMessageFromPreferences() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('solidWebId'); // Replace with your actual key
  }
}
