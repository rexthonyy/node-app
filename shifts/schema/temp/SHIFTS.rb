SHIFTS



ShiftGroups
id
channel_id/timezone
position
name





ShiftGroupMembers
id
channel_id
shift_group_id
user_id
position




OpenShifts
id
channel_id
shift_group_id
label
color
note
slots - number of people in shift
isOpen
start_date
start_time
end_time
is24Hours
unpaid_break_time [0|15|30|45|60|75|90]min



AssignedShifts
id
channel_id
shift_group_id
user_id
label
color
note
isOpen
start_date
start_time
end_time
is24Hours
unpaid_break_time [0|15|30|45|60|75|90]min



UserTimeOff
id
channel_id
shift_group_id
user_id
color
note
label [unpaid|sick day|parental leave|off|holiday]
start_date
start_time
end_time
is24Hours


OpenShiftActivities
id
channel_id
shift_group_id
open_shift_id
name
code
color [white|blue|green|purple|pink|yellow|gray|dark blue|dark green| dark purple|dark pink|dark yellow]
start_date
start_time
end_time
isPaid


AssignedShiftActivities
id
channel_id
shift_group_id
user_id
assigned_shift_id
name
code
color [white|blue|green|purple|pink|yellow|gray|dark blue|dark green| dark purple|dark pink|dark yellow]
start_date
start_time
end_time
isPaid


dayNotes
id
note
date




Requests
id
channel_id
user_id
receipient_id
type [time off|swap|offer]
created_at





RequestTimeOff
id
channel_id
request_id
user_id
isAllDay
start_date
start_time
end_date
end_time
reason [unpaid|sick day|parental leave|off|holiday]
request_note
response_note
status [pending|approved|declined]
response_by
created_at
response_at



RequestSwap
id
channel_id
request_id
user_id
user_assigned_shift_id
swap_user_assigned_shift_id
note
response_note
status [pending|approved|declined|cancelled]
created_at
response_at



RequestOffer
id
channel_id
request_id
user_id
user_assigned_shift_id
offered_to_user_id
note
created_at
status [pending|approved|declined|cancelled]
response_note
response_at



General Settings
id
key
value

timezone will be the branch