# 部署

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

   Windows不需要，直接使用pip安装依赖

   ```shell
   pip install -r requirements.txt
   ```

7. 启动服务

   ```shell
   python manage.py runserver 127.0.0.1:8000
   ```
