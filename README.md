
Bước 1: Cài đặt đầy đủ môi trường [Fabric prerequisites](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html)

Bước 2: (Tùy chọn): Nếu muốn sử dụng project firebase của bạn.</br>
    + Thay thông tin cấu hình firebase (biến firebaseConfig) trong file config.js(fabcar/javascript/controller/config.js).</br>
    + Thay thông tin cấu hình firebase (biến firebaseConfig) trong file config.js(fabcar/javascript/public/js/config.js).

Bước 3: Clone project về  máy (https://github.com/phucnguyen1901/HyperledgerLandAdministration)

Bước 4: Cài đặt các thư viện javascript</br>
    + cd fabcar/javascript </br>
    + npm install

Bước 5: Chạy mạng blockchain</br>
    + cd fabcar</br>
    + ./startFabric.sh (chạy mạng blockchain), ./networkDown.sh (nếu muốn thay đổi trong smart contract phải tắt rồi bật lại mạng)</br>
    + ./networkMonitor.sh (Tùy chọn) để xem debug code chạy trong chaincode

Bước 6: Chạy chương trình client</br>
    + cd fabcar/javascript</br>
    + npm start</br>
    + http://localhost:3000/

STEP 1: Install [Fabric prerequisites](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html)

STEP 2: (OPTION) If you want to use your firebase project.</br>
    + Replace initialize Firebase file in config.js(fabcar/javascript/controller/config.js).</br>
    + Replace initialize Firebase file in config.js(fabcar/javascript/public/js/config.js).

STEP 3: Git clone (https://github.com/phucnguyen1901/HyperledgerLandAdministration)

STEP 4: Install javascript library</br>
    + cd fabcar/javascript</br>
    + npm install

STEP 5: Run blockchain network</br>
    + cd fabcar</br>
    + ./startFabric.sh (run blockchain network), ./networkDown.sh (remove any containers or artifacts from any previous runs)</br>
    + ./networkMonitor.sh (Option) to show debugging in blockchain network.
    
STEP 6: Run client </br>
    + cd fabcar/javascript</br>
    + npm start </br>
    + http://localhost:3000/
