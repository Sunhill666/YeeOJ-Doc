# YeeOnlineJudge 项目开发文档

记录 YeeOnlineJudge 后端开发的心路历程，以及过程中的踩坑点以示后人

## 项目依赖

```shell
# pip list

Package             Version
------------------- -------
asgiref             3.5.2
Django              3.2.14
djangorestframework 3.13.1
pip                 22.1.2
psycopg2            2.9.3
pytz                2022.1
setuptools          62.6.0
sqlparse            0.4.2
wheel               0.37.1
```

## 首次提交至2022 年 7 月 24 日的提交

创建建了四个模块：

- contest
- organization
- problems
- utils

在settings.py中修改

```python
LANGUAGE_CODE = 'zh-cn'
TIME_ZONE = 'Asia/Shanghai'
USE_TZ = False
```

修改 **TIME_ZONE** 和 **USE_TZ** 来确保存入数据库和日志的时间是正确的

添加 **AVATAR_URI_PREFIX** 常量

```python
AVATAR_URI_PREFIX = "/public/avatar"
```

### contest模块

#### 模型

在 **contest.models** 中创建了Contest模型，因只是暂时引用，并未做完全设计

```python
from django.db import models


class Contest(models.Model):
    title = models.CharField("比赛标题", max_length=25)

    def __str__(self):
        return self.title
```

### organization模块

#### 模型

在 **organization.models** 中创建了User模型，继承自AbstractUser，还创建了Classes模型

在User模型中创建了Django的枚举类：

- UserRole
- UserAdmin

```python
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class Classes(models.Model):
    name = models.CharField(unique=True, max_length=25, default="非本系")

    class Meta:
        verbose_name = "class"
        verbose_name_plural = "classes"
        db_table = "classes"

    def __str__(self):
        return self.name


class User(AbstractUser):
    # Django枚举类
    class UserRole(models.TextChoices):
        TEACHER = 'TEC', _('老师')
        STUDENT = 'STU', _('学生')

    class UserAdmin(models.TextChoices):
        REGULAR_USER = 'RU', _("普通用户")
        ADMIN = 'AM', _("管理员")
        SUPER_ADMIN = 'SA', _("超级管理员")

    user_id = models.CharField("工号/学号", max_length=13, unique=True)
    user_role = models.CharField("用户角色", max_length=3, choices=UserRole.choices)
    user_admin = models.CharField("用户管理角色", max_length=2, choices=UserAdmin.choices)
    classes = models.ForeignKey(Classes, on_delete=models.CASCADE, null=True, related_name="users")
    solved_problems = models.JSONField("解决的问题", default=dict)
    avatar = models.TextField(default=f"{settings.AVATAR_URI_PREFIX}/default.png")

    commit_num = models.IntegerField("提交次数", default=0)
    accept_num = models.IntegerField("通过的提交", default=0)
    solved_num = models.IntegerField("已解决题数", default=0)

    def add_cnum(self):
        self.commit_num += 1

    def add_anum(self):
        self.accept_num += 1

    def add_snum(self):
        self.solved_num += 1

    def __str__(self):
        return self.get_full_name()

    class Meta:
        db_table = "user"
```

***！！！坑点！！！*** ：继承Django的AbstractUser需要在settings.py中添加，详见[Django官方文档](https://docs.djangoproject.com/zh-hans/3.2/topics/auth/customizing/#substituting-a-custom-user-model)
> 不要忘记将 AUTH_USER_MODEL 指向它。在创建任何迁移或者首次运行 manage.py migrate 之前执行这个操作。在你已经建立数据库表之后再去修改 AUTH_USER_MODEL 要困难的多，因为它会影响外键和多对多关系。

```python
AUTH_USER_MODEL = 'organization.User'
```

#### 序列化

**organization.serializers** 写了针对这两个模型的序列化程序

```python
from rest_framework import serializers
from .models import User, Classes


class ClassesSerialize(serializers.ModelSerializer):
    users = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Classes
        fields = '__all__'
        read_only_fields = ('id', 'users')


class UserSerializer(serializers.ModelSerializer):
    user_role = serializers.ChoiceField(choices=User.UserRole.choices)
    user_admin = serializers.ChoiceField(choices=User.UserAdmin.choices)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        get_pwd = validated_data.get("password")
        if get_pwd:
            try:
                instance.set_password(get_pwd)
                validated_data.pop("password")
            except:
                pass
        return super().update(instance, validated_data)

    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ('id', 'commit_num', 'accept_num', 'solved_num')
```

***！！！坑点！！！*** ：
使用ModelSerializer的create和update的方法不会将密码进行加密存储，需要重写这两个方法以实现密码的加密存储

#### 视图

在 **views.normal** 中编写organization的视图

使用DRF的ModelViewSet自动处理不同请求来执行相应的List、Create、Retrieve、Update和Delete操作

```python
from rest_framework import viewsets
from organization.models import User, Classes
from organization.serializers import UserSerializer, ClassesSerialize


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class ClassViewSet(viewsets.ModelViewSet):
    serializer_class = ClassesSerialize
    queryset = Classes.objects.all()
```

在 **urls.normal** 中编写访问地址，使用DRF的DefaultRouter来自动处理请求

```python
from rest_framework import routers

from organization.views.normal import UserViewSet, ClassViewSet

router = routers.DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'class', ClassViewSet)

urlpatterns = router.urls
```

### problem模块

#### 模型

problem模块的模型部分与前面的organization大同小异，创建了两个模型：

- ProblemTag
- Problem

值得说的一点是这两个模型之间为多对多的关系，则需要使用ManyToManyField这个字段。[详见Django官方文档](https://docs.djangoproject.com/zh-hans/3.2/topics/db/models/#extra-fields-on-many-to-many-relationships)

```python
class ProblemTag(models.Model):
    tag_name = models.CharField("标签名称", max_length=6)
    ...


class Problem(models.Model):
    tags = models.ManyToManyField(ProblemTag, related_name='problems')
    ...
```

#### 序列化

在序列化时因前面提到的多对多的关系，需要用到SlugRelatedField。详见[DRF官方文档](https://www.django-rest-framework.org/api-guide/relations/#slugrelatedfield)

```python
class ProblemTagSerializers(serializers.ModelSerializer):
    problems = serializers.StringRelatedField(many=True, read_only=True)
    ...


class ProblemSerializers(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(many=True, slug_field='tag_name', queryset=ProblemTag.objects.all())
    ...
```

还有在执行List操作时分页也是不可少内容，在problem模块下编写 pagination.py。详见[DRF官方文档](https://www.django-rest-framework.org/api-guide/pagination/)

```python
from rest_framework.pagination import PageNumberPagination


class ProblemNumPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "size"
    max_page_size = 40
```

这样在访问时添加size或page参数可以调节页面大小和页码了

#### 视图

视图这部分需要把自己的分页类添加上

```python
class ProblemViewSet(viewsets.ModelViewSet):
    pagination_class = ProblemNumPagination
    ...


class ProblemTagViewSet(viewsets.ModelViewSet):
    ...
```

### utils模块

暂未做设计
