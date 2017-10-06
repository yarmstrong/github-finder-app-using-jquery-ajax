$(document).ready(function() {
  let aoth_key = {
    client_id: 'aef4e29b669d12f17ccf',
    client_secret: '076e29713f8df9f9dffe8ae38a3bb73c754cad3d'
  };

  $('#searchUser').on('keyup', function() {
    let username = this.value;

    if (username === '') {
      return false;
    }

    // make the github request to extract user
    $.ajax({
      url: 'https://api.github.com/users/'+username,
      data: aoth_key
    }).done(function(user) {
      
      // update the page with the extracted info
      update_profile(user);

      // make another request to extract repos info if there is
      if (user.public_repos > 0) {
        extract_repos(aoth_key, username);
      }
      
    });
  });
});

function update_profile(user) {
  $('#profile').html(
    `
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">${user.name}</h3>
      </div>
      <div class="panel-body">
        <div class="row">
          <div class="col-md-3">
            <img src="${user.avatar_url}" alt="avatar" class="thumbnail avatar" style="width: 100%">
            <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block">View Profile</a>
          </div>
          <div class="col-md-6">
            <span class="label label-default">Public Repos: ${user.public_repos}</span>
            <span class="label label-primary">Public Gists: ${user.public_gists}</span>
            <span class="label label-success">Followers: ${user.followers}</span>
            <span class="label label-info">Following: ${user.following}</span>
            <br><br>
            <ul class="list-group">
              <li class="list-group-item">Company: ${user.company}</li>
              <li class="list-group-item">Website: ${user.blog}</li>
              <li class="list-group-item">Location: ${user.location}</li>
              <li class="list-group-item">Member Since: ${user.created_at}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    `
  );
}

function extract_repos(aoth_key, username) {
  $.ajax({
    url: 'https://api.github.com/users/'+username+'/repos',
    data: aoth_key,
    sort: 'created: asc',
    per_page: 5
  }).done(function(repos) {
    let template = '';
    $.each(repos, function(index, repo) {
      template += `
      <div class="well">
        <div class="row">
          <div class="col-md-7">
            <strong>${repo.name}</strong>: ${repo.description}
          </div>
          <div class="col-md-3">
            <span class="label label-default">Forks: ${repo.forks_count}</span>
            <span class="label label-primary">Watchers: ${repo.watchers_count}</span>
            <span class="label label-success">Stars: ${repo.stargazers_count}</span>
          </div>
          <div class="col-md-2">
            <a href="${repo.html_url}" target="_blank" class="btn btn-primary btn-block">Repo Page</a>
          </div>
        </div>
      </div>`;
    });
    $('#profile').append('<h3 class="page-header">Latest Repos</h3>' + template);
  });
}