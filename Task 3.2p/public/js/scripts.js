const cardList = [
    {
        title: "SIT725 - Applied Software Engineering",
        image: "images/s2.jpg",
        link: "About",
        description: "Software solutions are helping to shape industry innovations across the world. In this unit you will learn to apply software engineering principles, tools, and practices in the design and development of a range of innovative software solutions. This unit covers advanced approaches to applying software engineering to application development, planning, analysis and design models and testing."
    },
    {
        title: "SIT317_SIT726 - Information Technology Innovations and Entrepreneurship",
        image: "images/s1.jpg",
        link: "About",
        description: "Software solutions are helping to shape industry innovations across the world. In this unit you will learn to apply software engineering principles, tools, and practices in the design and development of a range of innovative software solutions. This unit covers advanced approaches to applying software engineering to application development, planning, analysis and design models and testing."
    },
    {
        title: "SIT223_SIT753 - Professional Practice in Information Technology",
        image: "images/s3.jpg",
        link: "About",
        description: "To be successful IT graduates need to understand the use of industry tools and practices, the ways these tools work and connect together, and the underlying professional, ethical, and teamwork knowledge and skills needed to put these into practice in a professional manner. This unit introduces students to IT workflows, agile project management, dev-ops pipelines, version control, and the ways these tools fit together in modern companies. The use of these technologies is underpinned by the behaviours, teamwork, and ethical considerations needed to engage in working in IT in a professional manner. The unit will tackle the big issues facing IT industry with a focus on gender equity and diversity, helping ensure our future IT leaders are well placed to address this and other challenging issues."
    },
    {
        title: "SIT719 - Analytics For Security And Privacy",
        image: "images/s4.jpg",
        link: "About",
        description: "The increased size of computer networks has led to extensive generation of data collected for network defence. A need has arisen for security experts that understand how to build analytics that make use of this data in order to detect or prevent attacks. This unit will provide students with the fundamental tools to understand this domain of cyber-security. Students will examine this challenge from multiple perspectives. The unit starts from the basics of building scripts to answer questions of large packet captures as a foundational skillset. Once students are comfortable working with large data sets, they will use this new skill to study several supervised machine learning approaches and apply them to real-world network datasets to build analytics that has been shown to be able to detect various malicious attacks. After becoming comfortable with supervised approaches, students will pivot to examining unsupervised methods for network defence, an important topic, since frequently there are insufficient available examples of malicious behaviour to train good models."
    },
    
];

const clickMe = () => {
    alert("Thanks for clicking me. Hope you have a nice day!");
};
const submitForm = () => {
    let formData = {};
    formData.first_name = $('#first_name').val();
    formData.last_name = $('#last_name').val();
    formData.password = $('#password').val();
    formData.email = $('#email').val();
    console.log("Form Data Submitted: ", formData);
    alert("Form Submitted Successfully");    }


const addCards = (items) => {
    items.forEach(item => {
        let itemToAppend = '<div class="col s4 center-align">' +
            '<div class="card medium"><div class="card-image waves-effect waves-block waves-light"><img class="activator" src="' + item.image + '">' +
            '</div><div class="card-content">' +
            '<span class="card-title activator grey-text text-darken-4">' + item.title + '<i class="material-icons right">more_vert</i></span><p><a href="#">' + item.link + '</a></p></div>' +
            '<div class="card-reveal">' +
            '<span class="card-title grey-text text-darken-4">' + item.title + '<i class="material-icons right">close</i></span>' +
            '<p class="card-text">' + item.description + '</p>' +
            '</div></div></div>';
        $("#card-section").append(itemToAppend);
    });
};

$(document).ready(function() {
    $('.materialboxed').materialbox();
    
    // Initialize the modal
    $('.modal').modal();

    // Open the modal when the "Click Me" button is clicked
    $('#clickMeButton').click(() => {
        $('#modal1').modal('open'); // Open the modal
    });

    $('#formSubmit').click(() => {
        submitForm();
    });

    addCards(cardList);
});