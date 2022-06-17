getMembersNotInGroup(channel_id, group_id)
getShiftGroupMembers(channel_id, group_id)
getShifts(channel_id, group_id, start_date, end_date)
getAllShifts
getRequests(channel_id)
####getDayNotes####

shiftGroupCreate
shiftGroupsReorder
shiftGroupRename
shiftGroupDelete

shiftGroupMemberAdd
shiftGroupMembersReorder
shiftGroupMemberRemove(group_id, user_id)

shiftAdd
shiftEdit
shiftDelete
shiftMoveToOpen

openShiftAdd
openShiftEdit
openShiftDelete
openShiftAssign

timeOffAdd
timeOffEdit
timeOffDelete

dayNoteUpdate

requestCreateTimeOff(channel_id)
requestCreateSwap(channel_id)
requestCreateOffer(channel_id)

respondRequestTimeOff(channel_id, request_id, user_id, responseStatus, note)
respondRequestSwap(channel_id, request_id, responseStatus, note)
respondRequestOffer(channel_id, request_id, responseStatus, note)

cancelRequestSwap(channel_id, request_id)
cancelRequestOffer(channel_id, request_id)
