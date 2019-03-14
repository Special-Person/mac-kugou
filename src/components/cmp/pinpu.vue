<template>
    <div class="wrap">
        <ul class="music">
            <li class="m1"></li>
            <li class="m2"></li>
            <li class="m3"></li>
        </ul>
    </div>
</template>

<script>
export default {};
</script>

<style >
.wrap {
    float: left;
    height: 40px;
    width: 25px;
    position: relative;
}
.wrap ul {
    height: 100%;
    vertical-align: baseline;
    font-size: 0;
    padding-left: 4px;
}
.wrap ul li {
    margin-left: 3px;
    display: inline-block;
    width: 2px;
    height: 28px;
    transform-origin: 0 37px;
}
.m1 {
    transform: scaleY(0.4);
    animation: 0.8s 0.1s linear infinite backwards normal;
    animation-delay: -1.1s;
}
.m2 {
    transform: scaleY(0.5);
    animation: 0.8s 0.3s linear infinite backwards normal;
    animation-delay: -1.3s;
}
.m3 {
    transform: scaleY(0.3);
    animation: 0.8s 0.6s linear infinite backwards normal;
    animation-delay: -1.6s;
}
@keyframes living {
    0% {
        transform: scaleY(0.5);
        transform-origin: 0 38px;
    }
    50% {
        transform: scaleY(0.3);
        transform-origin: 0 38px;
    }
    100% {
        transform: scaleY(0.5);
        transform-origin: 0 38px;
    }
}
</style>
