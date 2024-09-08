

service_options: [
    {
        option_id: 545,
        native_value: 
    }
]


native_value: 5
//===================
native_value: json
//===================
native_value: [
    "sdfdsfds64",
    "sdfdsfds64",
    "sdfdsfds64",
]
//===================
option_values: [
    {
        option_value_id: 515
    }
]


values.forEach((item, index) => {
    
    fd.appent(`service_options[${index}][option_id]`, 54)
    fd.appent(`service_options[${index}][native_value]`, 852)
});


fd.appent('service_options[1][option_id]', 54)
fd.appent('service_options[1][native_value]', 852)



fd.appent('service_options[0][native_value]',JSON.stringify() )
fd.appent('service_options[0][native_value][0]', )
fd.appent('service_options[0][option_values][0][option_value_id]', )