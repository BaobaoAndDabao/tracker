let baseUrl = "";   //这里是一个默认的url，可以没有
switch (process.env.NODE_ENV) {
    case 'development':
        baseUrl = "http://localhost:443/"  //这里是本地的请求url
        break
    case 'dev':   // 注意这里的名字要和步骤二中设置的环境名字对应起来
        baseUrl = "http://localhost:443/"  //这里是测试环境中的url
        break
    case 'production':
        baseUrl = "http://8.142.139.252:443/"   //生产环境url
        break
}

export default baseUrl;