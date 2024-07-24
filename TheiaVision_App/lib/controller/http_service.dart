import 'dart:developer';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:theia/utils.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class HttpService {
 // static const String serverURL = "https://f675d8bd575f54b3439c221af95aab70.serveo.net/api";

  static const String serverURL = "https://theiabo.logimade.com/api";
  final Dio _dio = Dio();

  bool isOk(int code) {
    if (code < 300 && code > 199) {
      return true;
    } else {
      return false;
    }
  }

  Future<Response<dynamic>> getRequest(
      String url,
      Map<String, dynamic> queryParameters,
      Map<String, dynamic> headers,
      BuildContext? context,
      {ResponseType responseType = ResponseType.json}) async {
    try {
      var response = await _dio.get(
        "$serverURL/$url",
        queryParameters: queryParameters,
        options: Options(
            headers: headers,
            validateStatus: (a) {
              return true;
            },
            responseType: responseType,
           ),
      );

      if (context != null && response.statusCode == 401) {
        if (context.mounted) {
          logOut(context);
        }
      }

      if (response.statusCode == 500) {
        log("Server error: ${response.data}");

        if (context == null || !context.mounted) {
          AppLocalizations t =
              await AppLocalizations.delegate.load(const Locale('en'));
          throw HttpException(t.unexpected_error_message);
        }
        throw HttpException(
          AppLocalizations.of(context)!.unexpected_error_message,
        );
      }

      return response;
    } on DioException catch (ex) {
      if (ex.type == DioExceptionType.connectionError) {
        if (context == null || !context.mounted) {
          AppLocalizations t =
              await AppLocalizations.delegate.load(const Locale('en'));
          throw HttpException(t.connection_error_message);
        }

        throw HttpException(
          AppLocalizations.of(context)!.connection_error_message,
        );
      } else if (ex.type == DioExceptionType.connectionTimeout) {
        if (context == null || !context.mounted) {
          AppLocalizations t =
              await AppLocalizations.delegate.load(const Locale('en'));
          throw HttpException(t.connection_timeout_message);
        }

        throw HttpException(
          AppLocalizations.of(context)!.connection_timeout_message,
        );
      }
      throw HttpException(ex.message!);
    }
  }

  Future<Response<dynamic>> postRequest(
      String url,
      dynamic data,
      Map<String, dynamic> headers,
      BuildContext? context,
      Function(dynamic, dynamic) onSend) async {
    try {
      var response = await _dio.post("$serverURL/$url",
          data: data,
          options: Options(
            headers: headers,
            validateStatus: (a) {
              return true;
            },
          ),
          onSendProgress: onSend);

      if (context != null && response.statusCode == 401) {
        if (context.mounted) {
          logOut(context);
        }
      }

      if (response.statusCode == 500) {
        log("Server error: ${response.data}");

        if (context == null || !context.mounted) {
          AppLocalizations t =
              await AppLocalizations.delegate.load(const Locale('en'));
          throw HttpException(t.unexpected_error_message);
        }
        throw HttpException(
          AppLocalizations.of(context)!.unexpected_error_message,
        );
      }

      return response;
    } on DioException catch (ex) {
      if (ex.type == DioExceptionType.connectionError) {
        if (context == null || !context.mounted) {
          AppLocalizations t =
              await AppLocalizations.delegate.load(const Locale('en'));
          throw HttpException(t.connection_error_message);
        }

        throw HttpException(
          AppLocalizations.of(context)!.connection_error_message,
        );
      } else if (ex.type == DioExceptionType.connectionTimeout) {
        if (context == null || !context.mounted) {
          AppLocalizations t =
              await AppLocalizations.delegate.load(const Locale('en'));
          throw HttpException(t.connection_timeout_message);
        }

        throw HttpException(
          AppLocalizations.of(context)!.connection_timeout_message,
        );
      }
      throw HttpException(ex.message!);
    }
  }

  Future<Response<dynamic>> putRequest(String url, dynamic data,
      Map<String, dynamic> headers, BuildContext? context) async {
    try {
      var response = await _dio.put(
        "$serverURL/$url",
        data: data,
        options: Options(
            headers: headers,
            validateStatus: (a) {
              return true;
            }),
      );

      if (context != null && response.statusCode == 401) {
        if (context.mounted) {
          logOut(context);
        }
      }

      if (response.statusCode == 500) {
        log("Server error: ${response.data}");

        if (context == null || !context.mounted) {
          AppLocalizations t =
              await AppLocalizations.delegate.load(const Locale('en'));
          throw HttpException(t.unexpected_error_message);
        }
        throw HttpException(
          AppLocalizations.of(context)!.unexpected_error_message,
        );
      }

      return response;
    } on DioException catch (ex) {
      if (ex.type == DioExceptionType.connectionError) {
        if (context == null || !context.mounted) {
          AppLocalizations t =
              await AppLocalizations.delegate.load(const Locale('en'));
          throw HttpException(t.connection_error_message);
        }

        throw HttpException(
          AppLocalizations.of(context)!.connection_error_message,
        );
      } else if (ex.type == DioExceptionType.connectionTimeout) {
        if (context == null || !context.mounted) {
          AppLocalizations t =
              await AppLocalizations.delegate.load(const Locale('en'));
          throw HttpException(t.connection_timeout_message);
        }

        throw HttpException(
          AppLocalizations.of(context)!.connection_timeout_message,
        );
      }
      throw HttpException(ex.message!);
    }
  }

  Future<Response<dynamic>> deleteRequest(String url, dynamic data,
      Map<String, dynamic> headers, BuildContext? context) async {
    try {
      var response = await _dio.delete(
        "$serverURL/$url",
        data: data,
        options: Options(
            headers: headers,
            validateStatus: (a) {
              return true;
            }),
      );

      if (context != null && response.statusCode == 401) {
        if (context.mounted) {
          logOut(context);
        }
      }
      if (response.statusCode == 500) {
        log("Server error: ${response.data}");

        if (context == null || !context.mounted) {
          AppLocalizations t =
              await AppLocalizations.delegate.load(const Locale('en'));
          throw HttpException(t.unexpected_error_message);
        }
        throw HttpException(
          AppLocalizations.of(context)!.unexpected_error_message,
        );
      }

      return response;
    } on DioException catch (ex) {
      if (ex.type == DioExceptionType.connectionError) {
        if (context == null || !context.mounted) {
          AppLocalizations t =
              await AppLocalizations.delegate.load(const Locale('en'));
          throw HttpException(t.connection_error_message);
        }

        throw HttpException(
          AppLocalizations.of(context)!.connection_error_message,
        );
      } else if (ex.type == DioExceptionType.connectionTimeout) {
        if (context == null || !context.mounted) {
          AppLocalizations t =
              await AppLocalizations.delegate.load(const Locale('en'));
          throw HttpException(t.connection_timeout_message);
        }

        throw HttpException(
          AppLocalizations.of(context)!.connection_timeout_message,
        );
      }
      throw HttpException(ex.message!);
    }
  }

  Future<Response<dynamic>> patchRequest(String url, dynamic data,
      Map<String, dynamic> headers, BuildContext? context) async {
    try {
      var response = await _dio.patch(
        "$serverURL/$url",
        data: data,
        options: Options(
            headers: headers,
            validateStatus: (a) {
              return true;
            }),
      );

      if (context != null && response.statusCode == 401) {
        if (context.mounted) {
          logOut(context);
        }
      }

      if (response.statusCode == 500) {
        log("Server error: ${response.data}");

        if (context == null || !context.mounted) {
          AppLocalizations t =
              await AppLocalizations.delegate.load(const Locale('en'));
          throw HttpException(t.unexpected_error_message);
        }
        throw HttpException(
          AppLocalizations.of(context)!.unexpected_error_message,
        );
      }

      return response;
    } on DioException catch (ex) {
      if (ex.type == DioExceptionType.connectionError) {
        if (context == null || !context.mounted) {
          AppLocalizations t =
              await AppLocalizations.delegate.load(const Locale('en'));
          throw HttpException(t.connection_error_message);
        }

        throw HttpException(
          AppLocalizations.of(context)!.connection_error_message,
        );
      } else if (ex.type == DioExceptionType.connectionTimeout) {
        if (context == null || !context.mounted) {
          AppLocalizations t =
              await AppLocalizations.delegate.load(const Locale('en'));
          throw HttpException(t.connection_timeout_message);
        }

        throw HttpException(
          AppLocalizations.of(context)!.connection_timeout_message,
        );
      }
      throw HttpException(ex.message!);
    }
  }

  Future<Response<dynamic>> headRequest(
      String url, Map<String, dynamic> headers, BuildContext? context) async {
    try {
      var response = await _dio.head(
        "$serverURL/$url",
        options: Options(
            headers: headers,
            validateStatus: (a) {
              return true;
            }),
      );

      if (context != null && response.statusCode == 401) {
        if (context.mounted) {
          logOut(context);
        }
      }

      if (response.statusCode == 500) {
        log("Server error: ${response.data}");

        if (context == null || !context.mounted) {
          AppLocalizations t =
              await AppLocalizations.delegate.load(const Locale('en'));
          throw HttpException(t.unexpected_error_message);
        }
        throw HttpException(
          AppLocalizations.of(context)!.unexpected_error_message,
        );
      }

      return response;
    } on DioException catch (ex) {
      if (ex.type == DioExceptionType.connectionError) {
        if (context == null || !context.mounted) {
          AppLocalizations t =
              await AppLocalizations.delegate.load(const Locale('en'));
          throw HttpException(t.connection_error_message);
        }

        throw HttpException(
          AppLocalizations.of(context)!.connection_error_message,
        );
      } else if (ex.type == DioExceptionType.connectionTimeout) {
        if (context == null || !context.mounted) {
          AppLocalizations t =
              await AppLocalizations.delegate.load(const Locale('en'));
          throw HttpException(t.connection_timeout_message);
        }

        throw HttpException(
          AppLocalizations.of(context)!.connection_timeout_message,
        );
      }
      throw HttpException(ex.message!);
    }
  }
}
