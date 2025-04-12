const loadTasks = () => {
    const token = localStorage.getItem('jwtToken');
    $.ajax({
      method: "GET",
      url: "/api/tasks",
      headers: {
        'Authorization': `Bearer ${token}`
      },
      success: function(tasks) {
        $('#task-list').empty();
        tasks.forEach(task => {
          $('#task-list').append(`
            <div class="col s12 m6">
              <div class="card">
                <div class="card-content">
                  <span class="card-title">${task.title}</span>
                  <p>${task.description}</p>
                  <p>Due: ${new Date(task.dueDate).toLocaleDateString()}</p>
                  <p>Status: ${task.status}</p>
                  <p>Assigned to: ${task.assignedTo ? task.assignedTo.username : 'Unassigned'}</p>
                </div>
              </div>
            </div>
          `);
        });
      },
      
      error: function(err) {
        console.error('Error loading tasks:', err);
      }
    });
  };
  
  $(document).ready(function(){
    // Additional initialization if required
  });
  