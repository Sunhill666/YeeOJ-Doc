# YeeOnlineJudge

## 简介

该仓库为YeeOnlineJudge的后端仓库，此项目基于Django，使用Django REST Framework实现前后端分离以及RESTful接口

本项目在设计之初参考和借鉴了[QingdaoU/OnlineJudge](https://github.com/QingdaoU/OnlineJudge)，在此对前辈们表达深深敬意

## 部署

### 本地部署

1. Clone项目到本地

   ```shell
   git clone https://github.com/Sunhill666/YeeOnlineJudge.git
   ```

2. 移步至项目文件夹

   ```shell
   cd ./YeeOnlineJudge
   ```

3. 安装Virtualenv

   ```shell
   pip install virtualenv
   ```

4. 创建虚拟环境

   ```shell
   virtualenv venv
   ```

5. 激活虚拟环境

   **Windows执行**

   ```shell
   source ./venv/Scripts/active
   ```

   **Linux执行**

   ```shell
   source ./venv/bin/active
   ```

6. 安装依赖

   **Linux环境须安装前置依赖**

   > 注意python-psycopg2版本问题，详见[此处](https://blog.csdn.net/z120379372/article/details/78899175)

   ```shell
   apt install libpq-dev python-psycopg2
   pip install -r requirements.txt
   ```

   Windows直接使用pip安装依赖

   ```shell
   pip install -r requirements.txt
   ```

7. 修改开发环境和生产环境

   ```shell
   # 开发坏境
   vim ./YeeOnlineJudge/dev_settings.py

   # 生产环境
   vim ./YeeOnlineJudge/prod_settings.py
   ```

8. 启动服务

   ```shell
   python manage.py makemigrations && python manage.py migrate
   python manage.py inital_user
   python manage.py runserver 0.0.0.0:8000
   ```

### Docker-compose 部署

1. 下载解压

   ```shell
   wget https://github.com/Sunhill666/YeeOnlineJudge/releases/download/0.0.1-220818-alpha/0.0.1-220818-alpha.zip
   unzip 0.0.1-220818-alpha.zip
   ```

2. 部署

   ```shell
   docker-compose up -d
   ```
