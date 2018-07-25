function autocomplete(input, latInput, lngInput) {
  // if no input, skip function
  if (!input) return;
  const dropdown = new google.maps.places.Autocomplete(input);
  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  });
  // if user presses ENTER on address field, don't submit form
  input.on('keydown', ev => {
    if (e.keyCode === 13) e.preventDefault();
  });
}

export default autocomplete;
