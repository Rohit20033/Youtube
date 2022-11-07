var videos =JSON.parse(localStorage.getItem("videos"))
console.log(videos)
var sv =document.querySelector("#selected_video")
var arr=[]
arr.push(videos)
arr.forEach(ele=> {
    
    var div =document.createElement("div")

    var iframe=document.createElement("iframe")
    iframe.src=`https://www.youtube.com/embed/${ele.videoId}`

    var h3=document.createElement("h3")
    h3.innerText=ele.title
    div.append(iframe,h3)
    sv.append(div)


});

document.querySelector("#logo").addEventListener("click",refreshwin)

function refreshwin(){
   window.location.reload()
}