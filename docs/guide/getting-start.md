# 部署指南

## 判题机部署

使用[judge0](https://github.com/judge0/judge0)作为本项目的判题机，具体部署可前去该项目的[Release](https://github.com/judge0/judge0/releases)页查看

## YeeOnlineJudge后端部署

### 本地部署

1. Clone项目到本地

    ```shell
    git clone https://github.com/Sunhill666/YeeOnlineJudge.git
    ```

2. 移步至项目文件夹

    ```shell
    cd ./YeeOnlineJudge
    ```

3. 安装 & 使用 Virtualenv 创建虚拟环境并激活（下以Linux端为例）

    ```shell
    python -m venv ./venv
    source ./venv/bin/active
    apt install libpq-dev
    pip install -r requirements.txt
    ```

4. 修改开发环境和生产环境

    ```shell
    # 开发坏境
    vim ./YeeOnlineJudge/dev_settings.py

    # 生产环境
    vim ./YeeOnlineJudge/prod_settings.py
    ```

5. 启动服务

    ```shell
    python manage.py makemigrations && python manage.py migrate
    python manage.py inital_user
    python manage.py runserver 0.0.0.0:8000
    ```

### Docker-compose 部署

1. 下载解压

    ```shell
    wget https://github.com/Sunhill666/YeeOnlineJudge/releases/download/0.0.1-220818-alpha/0.0.1-220818-alpha.zip
    unzip -d ./YeeOJ 0.0.1-220818-alpha.zip
    ```

2. 修改环境变量

    ```shell
    cd ./YeeOJ
    vim oj.env
    ```

3. 部署

    ```shell
    docker-compose up -d
    ```

### 坏境变量

- `oj.env` 说明

    ```shell
    CURRENT_ENV=dev # 部署环境
    POSTGRES_USER=oj_admin # 数据库用户
    POSTGRES_PASSWORD=ojoj_admin123 # 数据库密码
    POSTGRES_DB=oj_db # 数据库名称
    POSTGRES_HOST=judge_db # 数据库地址
    POSTGRES_PORT=5432 # 数据库端口
    CELERY_REDIS_HOST=redis://:judgeme_114514!@judge_redis:6379/
    REDIS_HOST=redis://judge_redis:6379/
    REDIS_PASSWORD=judgeme_114514!
    AUTHN_HEADER=X-Auth-Token
    AUTHN_TOKEN=neon-genesis-evangelion
    AUTHZ_HEADER=X-Auth-User
    AUTHZ_TOKEN=asuka-langley-soryu
    JUDGE_HOST=oj.moorlands.cn
    JUDGE_PORT=443
    JUDGE_SSL=true
    ```
