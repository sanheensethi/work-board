const request = {
    "url": "https://script.google.com/macros/s/AKfycbw8s-SBrPJgECEMvsAbXmevQkOg8sojlCTg8RyXht1J7bd13IsCvTJDLFZp0aKCUHzr1Q/exec",
}

const endpoints = {
    "get-json": request.url + '?exec=getJSON',
    "set-json": request.url + '?exec=setJSON',
    "get-tags": request.url + '?exec=allTags',
    "get-all-tasks": request.url + '?exec=allTasks',
    "add-task": request.url + '?exec=add',
    "delete-task": request.url + '?exec=delete',
    "update-task": request.url + '?exec=update'
}


export default endpoints;