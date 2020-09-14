## 平台前端框架

``` mermaid
graph TD

LandingPage[着陆页]
LoginPage[登陆页]
ControlPage[控制台]
ModulePage[模块页]
Sys-Manage[系统管理]
Data-Resource[数据资源]

LandingPage --> LoginPage --> ControlPage --> ModulePage

ModulePage --> Sys-Manage
ModulePage --> Data-Resource
