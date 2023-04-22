document.addEventListener('DOMContentLoaded',()=>{
    let spinner_timer;
    let interval ;
    let endDate;
    const menuCheckBox = document.querySelector('#check');
    const arrow_more = document.querySelector('.svg_arrow');
    const main_page_buttons = document.querySelectorAll('[data-type="main_page"]');
    const more_information_page_buttons = document.querySelectorAll('[data-type="more_information"]');
    const test_contents_buttons = document.querySelector('.second_page').querySelectorAll('[data-type="next"]');
    const test_contents = document.querySelectorAll('.second_page_content');
    const test_start_buttons = document.querySelectorAll('[data-type="start_test"]');
    const pages = document.querySelectorAll('[data-type="page"]');
    const call_button = document.querySelector('.cp_6_text');

    function clearTest(){
        const testpage = document.querySelector('.second_page');
        testpage.querySelectorAll('[type="radio"]').forEach(item=>{
            item.checked=false;
        });
        testpage.querySelectorAll('[data-type="next"]').forEach(item=>{
            item.disabled=true;
        })
        const result_page = document.querySelector('.compleate_page');
        const result_div = result_page.querySelector('.information_container');
        if(result_div){result_page.removeChild(result_div);}
        resetCurrentProgress('.current_progress');
        call_button.disabled=false;
    }

    function changePageName(titleClassName,add=false){
        if(add){
            document.querySelector('.brain').classList.remove('hide');
            document.querySelector(titleClassName).classList.remove('hide');
        }
        else{
            document.querySelector('.brain').classList.add('hide');
            document.querySelector(titleClassName).classList.add('hide');
        }
    }

    menuCheckBox.addEventListener('change', function() {
        if (this.checked) {
          document.body.classList.add('disable_overflow_y');
        } else {
            document.body.classList.remove('disable_overflow_y');
        }
      });
    //more information


    function toggleVisiablePages(pageClass){
        const page = document.querySelector(pageClass);
        page.classList.toggle('hide');
    }
    function handleButtonClick(hiddenElement) {
        hiddenElement.scrollIntoView({block: "start", behavior: "smooth"});
     }
    function showMoreInformation(){
        toggleVisiablePages('.page_one_more_1');
        toggleVisiablePages('.page_one_more_2');
        toggleVisiablePages('.page_one_more_3');
        handleButtonClick(document.querySelector('.page_one_more_1'));
    }
    arrow_more.addEventListener('click',showMoreInformation);


    //start test


    function pagesNavigation(pages,visiablePage){
        if(menuCheckBox.checked){menuCheckBox.click();}
        pages.forEach(item=>{
            item.classList.contains(visiablePage)?item.classList.remove('hide'):item.classList.add('hide');
        })
        changePageName('.text_header');
        changePageName('.text_header_2');
        clearTest();
        clearTimeout(spinner_timer);
        clearInterval(interval);
    }
    test_start_buttons.forEach(item=>{
        item.addEventListener('click',()=>{
            showTestContent(test_contents);
            pagesNavigation(pages,'second_page');
            changePageName('.text_header',true);
    })
    })

    //go to main page

    main_page_buttons.forEach(item=>item.addEventListener('click',()=>pagesNavigation(pages,'page_one')));

    //go to more information page
    more_information_page_buttons.forEach(item=>item.addEventListener('click',()=>{
        pagesNavigation(pages,'page_one');
        setTimeout(showMoreInformation,4);
    }))

    //test
    function showTestContent(allContents,visibleContentNumber=0){
        allContents.forEach(item=>{
            item.classList.add('hide');
        })
        allContents[visibleContentNumber].classList.remove('hide');
    }
    function nextButtonEvent(test_contents, button_number,number_of_buttons){
        showTestContent(test_contents,button_number+1);
        increaseCurrentProgress('.current_progress',button_number+1,number_of_buttons);
    }

    test_contents_buttons.forEach((item,i,test_contents_buttons)=>item.addEventListener('click',()=>nextButtonEvent(test_contents,i,test_contents_buttons.length)));
    test_contents.forEach(item=>item.addEventListener('click',(e)=>{
        if(e.target.tagName==='INPUT'){
            const nextbutton =item.querySelector('[data-type="next"]');
            nextbutton.disabled=false;
        }
    }))
    function increaseCurrentProgress(current_progress_class,current_test_number,number_of_test){
        const current_progress= document.querySelector('.second_page').querySelector(current_progress_class);
        current_progress.style.width=`${current_test_number/number_of_test*100}%`;
    }
    function resetCurrentProgress(current_progress_class){
        const current_progress= document.querySelector('.second_page').querySelector(current_progress_class);
        current_progress.style.width=`0%`;
    }

    //end test
    function endTest(){
        spinner_timer = setTimeout(()=>{
            endDate=Date.parse(new Date)+1000*60*10;
            pagesNavigation(pages,'compleate_page');
            interval =setInterval(()=>{timer(endDate)},100);
            changePageName('.text_header_2',true);
        },3000)
    }

    test_contents_buttons[test_contents_buttons.length-1].addEventListener('click',endTest);

    //call button
    async function  httpReq(url,method = 'GET',body = null,headers = {'Content-Type':'application/json'}){
        let response= await fetch(url,{method,body,headers});
        const data =await response.json();
        return data;
    }

    function loadingInformation(){
        const parent =document.querySelector('.compleate_page');
        const information_child = document.querySelector('.information_container');
        if(!information_child){
            const new_information =document.createElement('div');
            new_information.classList.add('information_container');
            new_information.innerHTML=`Загрузка...`;
            parent.querySelector('.button_container_call').insertAdjacentElement('afterend',new_information);
        }else{
            information_child.innerHTML=`Загрузка...`;
        }
    }
    function loadedInformation(res){
        const information_child = document.querySelector('.information_container');
        information_child.innerHTML=``;
        for(key in res){
            information_child.innerHTML+=`${key}:${res[key]}<br>`;
        }
    }

    call_button.addEventListener('click',()=>{
        loadingInformation();
        httpReq('https://swapi.dev/api/people/1/')
            .then(res=>loadedInformation(res));
    });

    //timer
    function addZero(number){
        if(number<=9){return `0${number}`;}
        return number+'';
    }
    function timer(endDate){
        const nowDate = new Date();
        const minutes = document.getElementById('minutes');
        const seconds = document.getElementById('seconds');

        function getTimerValues(miliseconds){
            if(miliseconds<0){
                clearInterval(interval);
                call_button.disabled=true;
                return [0,0];
            }
            const minutes = Math.floor(miliseconds/(60*1000));
            const seconds = Math.floor((miliseconds-minutes*60*1000)/1000);
            return [minutes,seconds];
        }
        time = getTimerValues((endDate-nowDate));
        minutes.textContent=addZero(time[0]);
        seconds.textContent=addZero(time[1]);
    }
})