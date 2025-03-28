const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const projects = await res.json();
      console.log('Fetched projects:', projects);
      addCards(projects);
    } catch (err) {
      console.log('Error fetching projects:', err);
    }
  };
  

const submitForm = () => {
    let formData = {};
    formData.first_name = $('#first_name').val();
    formData.last_name = $('#last_name').val();
    formData.password = $('#password').val();
    formData.email = $('#email').val();
    console.log("Form Data Submitted: ", formData);
    alert("Form Submitted Successfully");    }


    
    const addCards = (projects) => {
        console.log("Adding cards:", projects); // Debugging
    
        $("#card-section").empty(); // Clear existing cards
    
        projects.forEach(project => {
            $("#card-section").append(`
              <div class="col s12 m6 l4">
                <div class="card" style="background-color: #333; color: white; height: 500px; display: flex; flex-direction: column;">
                  <div class="card-image" style="flex: 1;">
                    <img src="${project.image}" alt="${project.title}" style="object-fit: cover; height: 100%;">
                  </div>
                  <div class="card-content" style="flex: 1; overflow: hidden;">
                    <span class="card-title" style="font-weight: bold; font-size: 18px;">${project.title}</span>
                    <p style="font-size: 12px; max-height: 100px; overflow: auto; margin-top: 5px;">${project.description}</p>
                  </div>
                </div>
              </div>
            `);
        });
    }
    


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

    fetchProjects();
    
});