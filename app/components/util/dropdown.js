/**
 * Created by XRene on 2015/11/7.
 */
var btn = document.getElementsByClassName('achieve-btn')[0],
    itemsBox = document.getElementsByClassName('achieve-items')[0],
    url = 'http://localhost:63342/bjlabs/app/templ/';
btn.onclick = function (e) {
    var e = window.event || e,
        target = e.srcElement || e.target;
    e.stopPropagation();
    itemsBox.style.display = 'block';

    if(target.nodeName.toLowerCase() === 'li'){
        itemsBox.style.display = 'none';
        switch (target.innerHTML){
            case 'ѧ������':
                url = url + 'paper.html';
                break;
            case 'ר��':
                url = url + 'patent.html';
                break;
            case '�������Ȩ':
                url = url + 'software.html';
                break;
            default :
                break;
        }
        window.location = url;
    }
}

window.onclick = function () {
    itemsBox.style.display = 'none';
}