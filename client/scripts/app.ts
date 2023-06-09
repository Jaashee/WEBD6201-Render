"use strict";

//IIFE - Immediately Invoked Function Expression
//AKA  - Anonymous Self-Executing Function
(function () {
  /**
   * Converts first letters in a string to uppercase - lowercasing the rest (pascal casing)
   * @param {string} str
   * @returns {string}
   */
  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function DisplayHomePage(): void {
    console.log("Home Page");

    $("#AboutUsBtn").on("click", () => {
      location.href = "/about";
    });

    $("main").append(
      `<p id="MainParagraph" class="mt-3">This is my main paragraph</p>`
    );
    $("main").append(`<article>
                    <p id="ArticleParagraph" class="mt-3">This is my article paragraph</p></article>`);
  }

  function DisplayProductsPage(): void {
    console.log("Our Products Page");
  }

  function DisplayServicesPage(): void {
    console.log("Our Services Page");
  }

  function DisplayAboutUsPage(): void {
    console.log("About Us Page");
  }

  /**
   * Add a contact to localStorage
   * @param {string} fullName
   * @param {string} contactNumber
   * @param {string} emailAddress
   */
  function AddContact(fullName: string, contactNumber: string,  emailAddress: string ): void {
    let contact = new core.Contact(fullName, contactNumber, emailAddress);
    if (contact.serialize()) {
      let key = contact.FullName.substring(0, 1) + Date.now();
      localStorage.setItem(key, contact.serialize() as string);
    }
  }

  function ContactFormValidation(): void {
    ValidateField(
      "#fullName",
      /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/,
      "Please enter a valid first and lastname."
    );

    ValidateField(
      "#contactNumber",
      /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/,
      "Please enter a valid phone contact number."
    );

    ValidateField(
      "#emailAddress",
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/,
      "Please enter a valid email address"
    );
  }

  /**
   * This function will validate field input based on based regular expression
   * @param {string} input_field_id
   * @param {RegExp} regular_expression
   * @param {string} error_message
   */
  function ValidateField( input_field_id: string, regular_expression: RegExp,   error_message: string ) {
    let messageArea = $("#messageArea").hide();

    $(input_field_id).on("blur", function () {
      let inputFieldText = $(this).val() as string;
      if (!regular_expression.test(inputFieldText)) {
        $(this).trigger("focus").trigger("select");
        messageArea.addClass("alert alert-danger").text(error_message).show();
      } else {
        messageArea.removeAttr("class").hide();
      }
    });
  }

  function DisplayContactPage(): void {
    console.log("Contact Us Page");

    $("a[data='contact-list']").off("click");
    $("a[data='contact-list']").on("click", function () {
      location.href = "/contact-list";
    });

    ContactFormValidation();

    let sendButton = document.getElementById("sendButton") as HTMLElement;
    let subscribeCheckbox = document.getElementById(
      "subscribeCheckbox"
    ) as HTMLInputElement;

    sendButton.addEventListener("click", function (event) {
      if (subscribeCheckbox.checked) {
        let fullName = document.forms[0].fullName.value;
        let contactNumber = document.forms[0].contactNumber.value;
        let emailAddress = document.forms[0].emailAddress.value;

        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
          let key = contact.FullName.substring(0, 1) + Date.now();
          localStorage.setItem(key, contact.serialize() as string);
        }
      }
    });
  }

  function DisplayContactListPage(): void {
    console.log("ContactList Page");

    if (localStorage.length > 0) {
      let contactList = document.getElementById("contactList") as HTMLElement;
      let data = ""; // add deserialized data from localStorage

      let keys = Object.keys(localStorage); //return a string  array of keys

      let index = 1;
      for (const key of keys) {
        let contactData = localStorage.getItem(key) as string;
        let contact = new core.Contact();
        contact.deserialize(contactData);
        data += `<tr><th scope="row" class="text-center">${index}</th>
                             <td>${contact.FullName}</td>
                             <td>${contact.ContactNumber}</td>
                             <td>${contact.EmailAddress}</td>
                             <!-- emmet shothand -->
                             <!-- td.text-center>button[value=""].btn.btn-primary.btn-sm.edit>i.fas.fa-edit.fa.sm -->                                                                                   
                             <td class="text-center">
                                <button value="${key}" class="btn btn-primary btn-sm edit">
                                   <i class="fas fa-edit fa-sm"> Edit</i>
                               </button>
                             </td>
                             
                             <td class="text-center">
                                <button value="${key}" class="btn btn-danger btn-sm delete">
                                   <i class="fas fa-trash-alt fa-sm"> Delete</i>
                               </button>
                             </td>
                         </tr>`;
        index++;
      }
      contactList.innerHTML = data;

      //must use function and nmot arrow due to $this value (scope)
      $("button.delete").on("click", function () {
        //comfirm delete
        if (confirm("Delete contact, are you sure?")) {
          localStorage.removeItem($(this).val() as string);
        }
        location.href = "/contact-list";
      });

      //concatenate value (from edit link) to the edit.html#
      $("button.edit").on("click", function () {
        location.href = "/edit#" +  $(this).val() as string;
      });
    }

    $("#addButton").on("click", () => {
         location.href = "/edit#add";
    });
  }

  function DisplayEditPage(): void {
    console.log("Edit Contact Page");

    ContactFormValidation();

    let page : string = location.hash.substring(1) as string;

    switch (page) {
      case "add":
        //make modification to the Edit page to look like an Add page
        $("main>h1").text("Add Contact");
        $("#editButton").html(`<i class="fas fa-plus-circle fa-sm"></i> Add`);

        $("#editButton").on("click", (event) => {
          event.preventDefault();

          let fullName = document.forms[0].fullName.value as string;
          let contactNumber = document.forms[0].contactNumber.value as string;
          let emailAddress = document.forms[0].emailAddress.value as string;

          AddContact(fullName, contactNumber, emailAddress);
          //  refresh contact-list page
          location.href = "/contact-list";
        });

        $("#cancelButton").on("click", () => {
          location.href = "/contact-list";
        });
        break;
      default:
        {
          //edit case

          //get contact information from localStorage
          let contact = new core.Contact();
          contact.deserialize(localStorage.getItem(page) as string);

          //display the contact info in the edit form
          $("#fullName").val(contact.FullName);
          $("#contactNumber").val(contact.ContactNumber);
          $("#emailAddress").val(contact.EmailAddress);

          //when editButton is pressed - update the contact
          $("#editButton").on("click", (event) => {
            event.preventDefault();
            // get any changes from the form
            contact.FullName = $("#fullName").val() as string;
            contact.ContactNumber = $("#contactNumber").val() as string;
            contact.EmailAddress = $("#emailAddress").val() as string;

            // replace the item in localStorage
            localStorage.setItem(page, contact.serialize() as string);

            // return to the contact-list
            location.href = "/contact-list";
          });

          $("#cancelButton").on("click", () => {
            location.href = "/contact-list";
          });
        }
        break;
    }
  }

  function CheckLogin(): void {
    if (sessionStorage.getItem("user")) {
      //swap out the login link for a logout link
      $("#login").html(`<a id="logout" class="nav-link" href="#">
                            <i class="fas fa-sign-out-alt"></i> Logout</a>`);
    }

    $("#logout").on("click", function () {
      //perform logout
      sessionStorage.clear();

      $("#login").html(`<a class="nav-link" data="login">
                                                    <i class="fas fa-sign-in-alt"></i> Login</a>`);

      //redirect to login.html page
      location.href = "/login";
    });
  }

  function DisplayLoginPage(): void {
    console.log("Display Login Page");

    let messageArea = $("#messageArea");
    messageArea.hide();

    $("#loginButton").on("click", function () {
      let success = false;
      let newUser = new core.User();

      // AJAX GET REQUEST
      // $.get(URL,data,function(data,status,xhr),dataType)
      // URL --> Required. Specifies the URL you wish to request
      // DATA --> Optional. Specifies data to send to the server along with the request
      // function() --> Optional. Specifies a function to run if the request succeeds
      // DATATYPE --> Optional. Specifies the data type expected of the server response
      $.get("./data/users.json", function (data) {
        for (const user of data.users) {
          let username = document.forms[0].username.value as string;
          let password = document.forms[0].password.value as string;

          //check if the username and password
          console.log(data.user);
          if (username === user.Username && password === user.Password) {
            newUser.fromJSON(user);
            success = true;
            break;
          }
        }

        //if username and password matches.. success! Perform the login sequence.
        if (success) {
          //add user to session storage
          sessionStorage.setItem("user", newUser.serialize() as string);
          messageArea.removeAttr("class").hide();

          //redirect user to secure area of the site.
          location.href = "/contact-list";
        } else {
          // they do not match
          $("#username").trigger("focus").trigger("select");
          messageArea
            .addClass("alert alert-danger")
            .text("Error: Invalid Login Credentials")
            .show();
        }
      });
    });

    $("#cancelButton").on("click", function () {
      //clear the login form
      document.forms[0].reset();
      //return to the home page
      location.href = "/home";
    });
  }

  function DisplayRegisterPage(): void {
    console.log("Display Register Page");
  }

  function Display404Page(): void {
    console.log("Display 404 Page");
  }

  function AuthGuard(): void {
    let protected_routes: string[] = ["/contact-list", "/edit"] ;

    if (protected_routes.indexOf(location.pathname) > -1) {
      if (!sessionStorage.getItem("user")) {
          location.href = "/login";
      }
    }
  }


  /**
   * Entry point to the web application
   */
  function Start(): void {
    console.log("App Started!");

    let page_id = $("body")[0].getAttribute("id");

    CheckLogin();

    switch (page_id)
    {
      case "home":
        DisplayHomePage();
        break;
      case "about":
        DisplayAboutUsPage();
        break;
      case "services":
        DisplayServicesPage();
        break;
      case "contact":
        DisplayContactPage();
        break;
      case "contact-list":
        AuthGuard();
        DisplayContactListPage();
        break;
      case "products":
        DisplayProductsPage();
        break;
      case "register":
        DisplayRegisterPage();
        break;
      case "login":
        DisplayLoginPage();
        break;
      case "edit":
        AuthGuard();
        DisplayEditPage();
        break;
      case "404":
        Display404Page();
        break;
    }

  }


  window.addEventListener("load", Start);
})();
