async function submitForm(event) {
    const characterName = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const skinColor = document.getElementById('skinColor').value;
    const hairStyle = document.getElementById('hairstyle').value;
    const headShape = document.getElementById('headShape').value;
    const upperClothing = document.getElementById('upperClothing').value;
    const lowerClothing = document.getElementById('lowerClothing').value;

    const requestObj = {
        characterName: characterName,
        childAge: age,
        skinColor: skinColor,
        hairStyle: hairStyle,
        headShape: headShape,
        upperClothing: upperClothing,
        lowerClothing: lowerClothing
    }

    const response = await fetch('/api/avatars', {
        method: 'POST', body: JSON.stringify(requestObj),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('mary@example.com:123')
        }
    });

    const flashMessage = document.getElementsByClassName('flash-message')[0];
    flashMessage.removeAttribute('hidden');
    flashMessage.classList.remove('fail')
    flashMessage.classList.remove('success')

    if(response.status === 400) {
        flashMessage.innerText = 'Form was not filled correctly!'
        flashMessage.classList.add('fail');
    }
    else if(response.status === 201) {
        flashMessage.innerText = 'Avatar created successfully!'
        flashMessage.classList.add('success');
    }
    else {
        flashMessage.innerText = 'Critical server error!'
        flashMessage.classList.add('fail');
    }

}