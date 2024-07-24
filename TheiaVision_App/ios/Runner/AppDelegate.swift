import UIKit
import Flutter

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
    override func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        let controller : FlutterViewController = window?.rootViewController as! FlutterViewController
        let channel = FlutterMethodChannel(name: "disk_space", binaryMessenger: controller.binaryMessenger)
        channel.setMethodCallHandler({
            [weak self] (call: FlutterMethodCall, result: FlutterResult) -> Void in
            if call.method == "getFreeDiskSpace" {
                let freeSpaceGB = self?.getAvailableSpaceInGB() ?? 0
                result(freeSpaceGB)
            } else {
                result(FlutterMethodNotImplemented)
            }
        })

        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }

    private func getAvailableSpaceInGB() -> Double {
        if let attributes = try? FileManager.default.attributesOfFileSystem(forPath: FileManager.default.currentDirectoryPath) {
            if let freeSize = attributes[.systemFreeSize] as? NSNumber {
                return freeSize.doubleValue / (1024.0 * 1024.0 * 1024.0) // Convert bytes to GB
            }
        }
        return 0
    }
}
