-- Permanently remove the retired 25Live room-booking data.

begin;

update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  - 'room_booking_requests'
  - 'campus_rooms'
where coalesce(raw_app_meta_data, '{}'::jsonb) ?| array[
  'room_booking_requests',
  'campus_rooms'
];

update auth.users
set raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{dashboard_data}',
  (raw_user_meta_data -> 'dashboard_data')
    - '25live'
    - 'twentyFiveLive'
    - 'roomBookings'
    - 'campusRooms'
    - 'room_booking_requests'
    - 'campus_rooms',
  false
)
where jsonb_typeof(raw_user_meta_data -> 'dashboard_data') = 'object'
  and (raw_user_meta_data -> 'dashboard_data') ?| array[
    '25live',
    'twentyFiveLive',
    'roomBookings',
    'campusRooms',
    'room_booking_requests',
    'campus_rooms'
  ];

update public.staff_dashboard_data
set dashboard_data = dashboard_data
    - '25live'
    - 'twentyFiveLive'
    - 'roomBookings'
    - 'campusRooms'
    - 'room_booking_requests'
    - 'campus_rooms',
  updated_at = timezone('utc', now())
where dashboard_data ?| array[
  '25live',
  'twentyFiveLive',
  'roomBookings',
  'campusRooms',
  'room_booking_requests',
  'campus_rooms'
];

commit;
