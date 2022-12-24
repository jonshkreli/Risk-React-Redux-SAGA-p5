export function UpdateTable() {
    // $('#playersTable').text(initPlayersTable().html());
    $('#tableContainer table').replaceWith(initPlayersTable());
}