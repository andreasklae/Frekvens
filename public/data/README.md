# Data Files

## Directory Structure

Place photos in:
- `public/images/people/` - Photos for team members
- `public/images/roster/` - Photos for artists/DJs

## JSON Files

### people.json
Contains the data for "The People" section. Each entry should have:
- `id`: Unique identifier
- `name`: Person's name
- `role`: Object with `no` (Norwegian) and `en` (English) translations
- `description`: Optional object with `no` and `en` translations
- `imageUrl`: Path to image (e.g., `/images/people/person-1.jpg`)
- `links`: Optional object with social links:
  - `instagram`: Instagram URL
  - `soundcloud`: SoundCloud URL
  - `residentAdvisor`: Resident Advisor URL

### roster.json
Same structure as people.json, but for artists/DJs in the roster section.

## Image Handling

- If an image is missing or fails to load, the component will automatically show a default avatar icon
- Image paths should be relative to the public folder (start with `/images/`)
- Supported formats: JPG, PNG, WebP

## Example Entry

```json
{
  "id": "person-1",
  "name": "John Doe",
  "role": {
    "no": "Grunnlegger / DJ",
    "en": "Founder / DJ"
  },
  "description": {
    "no": "Beskrivelse av personen",
    "en": "Description of the person"
  },
  "imageUrl": "/images/people/person-1.jpg",
  "links": {
    "instagram": "https://instagram.com/johndoe",
    "soundcloud": "https://soundcloud.com/johndoe"
  }
}
```
