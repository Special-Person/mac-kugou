//jsonp 调用对象
var jsonp = {};
//调用方法
jsonp.get = function (url, data, callback) {
    this.createJsonp(url, data, callback);
};
//动态添加<script> 标签并组建请求url callback为跨域请求成功后回调函数
jsonp.createJsonp = function (url, data, callback) {
    var radom = Math.random() * 100;
    var number = parseInt(radom); //随机数字
    var callBackRadom = "jsonpSuccess_" + number; //指定回调函数
    window[callBackRadom] = callback;
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    var param = (query.length ? '?' + query.join('&') : '');
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (param != null && param.length > 0) {
        script.src = url + "" + param + "&callback=" + callBackRadom;
    }
    else {
        script.src = url + "?callback=" + callBackRadom;
    }
    script.id = callBackRadom; //指定id 是为了removeJsonp中动态去除<script>标签
    document.getElementsByTagName('head')[0].appendChild(script);
    this.removeJsonp(callBackRadom);
}
//成功后移除动态加载的<script>标签
jsonp.removeJsonp = function (id) {
    var head = document.getElementsByTagName('head')[0];
    var el = document.getElementById(id);
    if (head != null && el != null) {
        head.removeChild(el);
    }

}

module.exports = jsonp;