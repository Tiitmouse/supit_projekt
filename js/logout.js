const logout = () => {
    if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    }
    else{
        alert('You are not logged in');
    }
}