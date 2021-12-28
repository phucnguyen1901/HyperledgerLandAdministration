
Bước 1: Cài đặt đầy đủ môi trường [Fabric prerequisites](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html)

Bước 2: (Tùy chọn): Nếu muốn sử dụng project firebase của bạn.
    + Thay thông tin cấu hình firebase (biến firebaseConfig) trong file config.js(fabric-samples/fabcar/javascript/controller/config.js).
    + Thay thông tin cấu hình firebase (biến firebaseConfig) trong file config.js(fabric-samples/fabcar/javascript/public/js/config.js).

Bước 3: Clone project về  máy (https://github.com/phucnguyen1901/HyperledgerLandAdministration)

Bước 4: Cài đặt các thư viện javascript
    + cd fabric-samples/fabcar/javascript
    + npm install

Bước 5: Chạy mạng blockchain
    + cd fabric-samples/fabcar
    + ./startFabric.sh (chạy mạng blockchain), ./networkDown.sh (khi muốn tắt network)
    + ./networkMonitor.sh (Tùy chọn) để xem debug code chạy trong chaincode

Bước 6: Chạy chương trình client
    + cd fabric-samples/fabcar/javascript
    + npm start
    + http://localhost:3000/

STEP 1: Install [Fabric prerequisites](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html)

STEP 2: (OPTION) If you want to use your firebase project.
    + Replace initialize Firebase file in config.js(fabric-samples/fabcar/javascript/controller/config.js).
    + Replace initialize Firebase file in config.js(fabric-samples/fabcar/javascript/public/js/config.js).

STEP 3: Git clone (https://github.com/phucnguyen1901/HyperledgerLandAdministration)

STEP 4: Install javascript library
    + cd fabric-samples/fabcar/javascript
    + npm install

STEP 5: Run blockchain network
    + cd fabric-samples/fabcar/javascript
    + npm start
    + http://localhost:3000/

Bước 6: Run client 
    + cd fabric-samples/fabcar/javascript
    + npm start
    + http://localhost:3000/
