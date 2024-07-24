enum Connection {
  wifi,
  wifiData;


  static Connection getConnection(String state) {
    switch (state) {
      case "Connection.wifi":
        return Connection.wifi;
      case "Connection.wifiData":
        return Connection.wifiData;
    }
    return Connection.wifi;
  }

}

