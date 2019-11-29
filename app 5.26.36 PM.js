const urlRoot = "/";
const stripe = Stripe('pk_test_QUV3pT2NBH7sxel9LmXcxEIW00NPyDUugo');
// const stripe = Stripe('pk_live_GsquFcaJv5ZaC3Ocj5U7ibZC00r3wX89Pj');
const elements = stripe.elements();
addCardPresent = false;

//Stripe card styles
const style = {
    base: {
        font: 'MyriadPro-Regular',
        color: '#FFF',
        fontSmoothing: 'none',
        fontWeight: '550',
        lineHeight: '40px',
        padding: '24px',
        // backgroundColor: 'gray',
        fontSize: '14px',
        '::placeholder': {
            color: '#B3B3B3'
        },
        display: 'none',
    },
    invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
    }
};
const card = elements.create('card', { style: style });

// check if user is logged in, return true or false
const checkLogin = () => {
    return new Promise(async resolve => {
        await fetch(urlRoot + 'checklogin')
            .then(response => {
                if (!response.ok)
                    resolve(false);
                else resolve(true);
            })
            .catch(() => { resolve(false) });
    })
}

// handle user logging out
const logout = () => {
    fetch(urlRoot + 'Logout')
        .then(() => {
            window.location.href = "/";
        });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//Sends POST req to /processpayment to process a new order 
//@n is GB Limit.
const processOrder = async (n) => {
    let url = urlRoot + 'processpayment';
    let params = {
        'gblimit': n
    };
    await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
        .then(response => {
            window.location.href = "/dashboard";
        });
}

// handle registration form submission
const registerSubmit = async (e) => {
    e.preventDefault();
    let registerFName = document.getElementById('firstname-register').value,
        registerLName = document.getElementById('lastname-register').value,
        registerEmail = document.getElementById('email-register').value,
        registerPW = document.getElementById('password-register').value,
        registerPW2 = document.getElementById('password-confirm-register').value,
        registerErrors = document.getElementById('error-message-text-register'),
        registerSubmit = document.getElementById('register-submit'),
        url = urlRoot + 'createuser';

    registerErrors.innerHTML = "";
    if (registerFName === "" || registerLName === "" || registerEmail === "" || registerPW === "") {
        registerErrors.innerHTML = 'Please fill all fields';
        return;
    } else if (registerPW !== registerPW2) {
        registerErrors.innerHTML = 'Passwords do not match';
        return;
    }

    stripe.createToken(card).then(async result => {
        if (result.error) {
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
            return;
        };

        registerErrors.disabled = true;
        registerErrors.innerHTML = "Processing...";

        let params = {
            'email': registerEmail,
            'password': registerPW,
            'firstName': registerFName,
            'lastName': registerLName,
            'token': result.token.id
        };

        let esc = encodeURIComponent;
        let query = Object.keys(params)
            .map(k => esc(k) + '=' + esc(params[k]))
            .join('&');

        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: query
        })
            .then(response => {
                if (response.status != 200)
                    registerErrors.innerHTML = 'Unable to create account';
                else window.location.href = "/";
            });

    })
}

//Handle logging in
const loginSubmit = async e => {
    e.preventDefault();
    let loginEmail = document.getElementById('email-login').value,
        loginPW = document.getElementById('password-login').value,
        loginErrors = document.getElementById('error-message-text-login'),
        url = urlRoot + 'createuser',
        params = {
            'email': loginEmail,
            'password': loginPW
        };
    loginErrors.innerHTML = "";
    if (loginEmail === "" || loginPW === "") return;
    let esc = encodeURIComponent;
    let query = Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');

    await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
        .then(response => {
            if (response.status != 200)
                loginErrors.innerHTML = 'Invalid Username and/or Password';
            else window.location.href = "/dashboard";
        });
}

//Add listeners to the login and register forms
const addListeners = () => {
    if (document.getElementById('register-submit')) {
        document.getElementById('register-submit').addEventListener('click', registerSubmit)
    }
    if (document.getElementById('login-submit')) {
        document.getElementById('login-submit').addEventListener('click', loginSubmit)
    }
}

// handle loading home page
const indLoad = async () => {
    const lnkLogin = document.getElementById('lnkLogin'),
        lnkSignup = document.getElementById('lnkSignup')

    if (await checkLogin()) {
        lnkLogin.innerText = "Dashboard"
        lnkSignup.innerHTML = "Log Out";
    }
};


/*
Get the last four digits of the card of the signed in user
*/
const getLastFour = async () => {
    await fetch(urlRoot + 'lastfour')
        .then(response => response.json())
        .then(data => {
            if (data["data"].length > 0) {
                lastFour = data["data"][0]["last4"]
                $('#last4').text(lastFour)
            } else {
                $('#cardonfile').hide()

            }
        });
}

// handle stock loading of products
const loadStock = async () => {
    let box1 = document.getElementById('price1'),
        box2 = document.getElementById('price2'),
        box3 = document.getElementById('price3')


    await fetch(urlRoot + 'allstock')
        .then(response => response.json())
        .then(data => {
            box1.innerHTML = '$' + data[0];
            box2.innerHTML = '$' + data[1];
            box3.innerHTML = '$' + data[2];
        });

    if (await checkLogin()) {
        lnkLogin.innerText = "Dashboard"
        lnkSignup.innerHTML = "Log Out";
        getLastFour()
    }

    //Start button is the 
    $('.purchaseButton').click(async function () {
        if (!await checkLogin()) {
            window.location.href = "/login.html"
        } else {
            let num = this.id
            num = num.substring(num.length - 1, num.length)
            let price = $("#price" + num)[0].innerHTML
            price = price.substring(1)
            let quantity = $("#quantity" + num)[0].innerHTML
            quantity = quantity.substring(1, quantity.indexOf(' G')) //Strip the gigabtyes / year
            loadPurchaseModal(quantity, price)
        }
    })
}

const loadPurchaseModal = (quantity, price) => {

    $('#confirmbody').text("Are you sure you want to purchase  " + quantity + " gigabytes for $" + price + "?")
    $("#ex1").modal({
        fadeDuration: 150
    });

    $('#addCard').click(function () {
        if (!addCardPresent) {
            configureStripeBox()
        } else {
            card.unmount()
            addCardPresent = !addCardPresent
        }
    })
}

window.onload = function () {
    addListeners()


}
window.transitionToPage = function (href) {
    document.querySelector('body').style.opacity = 0
    setTimeout(function () {
        window.location.href = href
    }, 500)
}

document.addEventListener('DOMContentLoaded', function (event) {
    document.querySelector('body').style.opacity = 1
})

$('#lnkLogin').click(async function () {
    if (await checkLogin()) {
        window.location.href = "/dashboard"
    } else {
        window.location.href = "/login.html"
    }
})

$('#lnkSignup').click(async function () {
    if (!await checkLogin()) {
        window.location.href = "/register.html"
    } else {
        logout()
    }
})

$('.logoutButton').click(function () {
    logout()
})
const loginPage = async () => {
    // login = await checkLogin()
}

// fetch proxies from UserDashboard
const getData = (order = 0) => {
    return new Promise(async resolve => {
        await fetch(urlRoot + 'UserDashboard')
            .then(response => response.json())
            .then(data => {
                if (data) {
                    if (data["orders"][order] != undefined) {
                        setProxies(data["orders"][order].status, data["orders"][order].proxies, data["orders"][order].ordernum);
                        setPossibleLocations(data["locations"])
                        setProxOrderNumSpan(data["orders"][order].ordernum);


                        $('.generateButton').click(function () {
                            generateProxies(data["orders"][order].ordernum)
                        })
                        $("#selectOrderBox").css("display","inline-block");

                       
                    }

                }
            });
        resolve();
    })
}


const setProxOrderNumSpan = proxOrderNum =>
    (document.getElementById('ordernumber').innerHTML = "Order: " + proxOrderNum);
/*
Show all the DOM elements neccesary for having at least 1 order
*/
const ordersExistShowDOM = async (n) => {

    $('.generate').text("Generate")
    $('#firstRowProxyTable').text("No proxies have been generated.")
    $(".header").text("Generated Proxies (" + n + ")")
    $(".formLocation").show()
    $(".Quantity").show()
    $(".formName").show()
    $(".generateButton").show()
    $(".upgradeButton").text("Upgrade Storage")

}

$(".upgradeButton").click(function () {
    //TODO: move this to new page
    // processOrder(1)
})
/*
Generate Proxies from the user dashboard. 
Makes POST req to /createproxies with the
{number,location,ordernum}
*/
const generateProxies = async (ordernum) => {
    var locBox = document.getElementById("gen-quant"),
        numberBox = document.getElementById("Quantity"),
        quantity = numberBox.value,
        location = locBox.innerHTML;

    if (quantity == undefined || quantity == '') {
        return numberBox.style.borderColor = "red"
    }



    url = urlRoot + 'createproxies';
    params = {
        'number': quantity,
        'location': location,
        "ordernum": ordernum
    };


    await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
        .then(response => {
            //TODO: PUT A SPINNER HERE TO RELOAD THE CONTENT
            window.href = "/dashboard"
        });


    // select-selected

}

const dashLoad = async () => {
    let auth = await checkLogin();

    if (auth) loadDom();
    else window.location.href = "/login.html"
}
// load dom elements in dashboard
const loadDom = async () => {
    await getData();
};

// set proxy list
const setProxies = (status, proxies, ordernum) => {
    const proxList = document.getElementById('pstProxies');
    proxList.innerHTML = '';
    arrProxies = [];
    if (status == "Processing") {

        let li = document.createElement('li');
        let p = document.createElement('p')

        li.appendChild(p)

        p.innerHTML = "Thank you for waiting. If your order has been processing for an extended amount of time, please contact support."
        $('.upgradeButton').text("Upgrade Storage")

        $('.generate').text("Processing")
        return proxList.appendChild(li);
    }
    let b = document.createElement('button')

    //Only update table if we have proxies
    if (proxies.length > 1) {

        //Start from -1 for style reasons
        for (j = -1; j < proxies.length; j++) {
            let li = document.createElement('li');
            let p = document.createElement('p')
            let hr = document.createElement('hr')

            li.appendChild(p)


            //Copy all button
            if (j == -1) {
                let b = document.createElement('button')
                let b2 = document.createElement('button')
                b.style.bottom = "25px"
                b2.style.bottom = "75px"
                b2.style.color = '#C5170E'

                b.innerHTML = "Copy All"
                b2.innerHTML = "Delete All"

                b.className = "copyAll"
                b2.className = "deleteAll"

                li.appendChild(b)
                li.appendChild(b2)

                //Add and pad
                proxList.appendChild(li);
                proxList.appendChild(hr);
                proxList.appendChild(hr);
                proxList.appendChild(hr);


            } else {
                p.innerHTML = proxies[j];

                proxList.appendChild(li);
                proxList.appendChild(hr);
            }


            arrProxies.push(proxies[j]);
        }
        $('.copyAll').click(function () { copyAllProxies(proxies) })
        $('.deleteAll').click(function () { deleteAllProxies(ordernum) })

    } else {

        let li = document.createElement('li');
        let p = document.createElement('p')

        li.appendChild(p)

        p.innerHTML = "No Proxies."

        proxList.appendChild(li);
    }
    return ordersExistShowDOM(proxies.length)



};


// handle copying proxy list to clipboard
const copyAllProxies = (arrProxies) => {
    let textarea = document.createElement('textarea');
    for (i = 0; i < arrProxies.length; i++) {
        textarea.value += arrProxies[i] + "\n";
    }

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    window.scrollTo(0, 0);
}

// handle deleting the proxy list
const deleteAllProxies = async (ordernum) => {
    let url = urlRoot + 'deleteall';
    let params = {
        'ordernum': ordernum
    };

    await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
        .then(response => {
            window.location.href = "/dashboard";
            //TODO: REPLACE WITH LOADER
        });
}


// set locations dropdown
const setPossibleLocations = locations => {
    const locationDropdown = document.getElementById('locationOptions');
    locationDropdown.innerHTML = 'Loading...';
    locationItems = [];
    if (locations.length == 0) {
        locationItems.push("No proxies available.")
    }
    // $('.extrabox').remove()

    for (j = 0; j < locations.length; j++) {
        let li = document.createElement('option');
        li.value = j
        li.innerHTML = locations[j]



        locationDropdown.appendChild(li);

    }

    renderDropdown()



};


const renderDropdown = () => {
    var x, i, j, selElmnt, a, b, c;
    /* Look for any elements with the class "custom-select": */
    x = document.getElementsByClassName("custom-select");
    for (i = 0; i < x.length; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        /* For each element, create a new DIV that will act as the selected item: */
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        a.setAttribute("id", "gen-quant");

        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        /* For each element, create a new DIV that will contain the option list: */
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items select-hide");
        for (j = 0; j < selElmnt.length; j++) {
            /* For each option in the original select element,
            create a new DIV that will act as an option item: */
            c = document.createElement("DIV");
            c.innerHTML = selElmnt.options[j].innerHTML;
            c.addEventListener("click", function (e) {
                /* When an item is clicked, update the original select box,
                and the selected item: */
                var y, i, k, s, h;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                h = this.parentNode.previousSibling;
                for (i = 0; i < s.length; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        for (k = 0; k < y.length; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }
                }
                h.click();
            });
            b.appendChild(c);
        }
        x[i].appendChild(b);
        a.addEventListener("click", function (e) {
            /* When the select box is clicked, close any other select boxes,
            and open/close the current select box: */
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }
}
function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x, y, i, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    for (i = 0; i < y.length; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < x.length; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }

}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);


const configureStripeBox = () => {
    card.mount('#card-element');
    addCardPresent = true;
    card.addEventListener('change', function (event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
}