/**
 * The client sided script that allows the use of a single instance of localStorage
 * accross domains
 */

window.addEventListener('message', function(e) {
    if (e.origin !== 'http://localhost:8000')
        return console.error('Invalid origin', e.origin);

    var data = e.data;

    if (data.action === 'store') {
        if (!data.value) {
            localStorage.removeItem(data.key);
        } else {
            localStorage.setItem(data.key, data.value);
        }
    } else if (data.action === 'get') {
        var value = localStorage.getItem(data.key);

        window.parent.postMessage({
            value: value,
            transactionKey: data.transactionKey
        }, '*');
    }
});
