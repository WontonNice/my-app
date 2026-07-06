# Room photos

Room photos live in this folder so they ship with the application and never use Supabase storage.

Name each JPEG after the room ID shown by the application:

- `101.jpg`
- `commons.jpg`
- `room-a1b2c3d4.jpg`

The staff room-details view automatically loads `/images/rooms/{room-id}.jpg`. If a photo is missing, it shows a helpful placeholder with the expected filename.
