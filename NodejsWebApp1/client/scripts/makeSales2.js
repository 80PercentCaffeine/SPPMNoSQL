    $(document).on('click', '.add', function(){
        console.log(this.parentNode.parentNode.outerHTML);
        it=this.parentNode.parentNode;
        $(it).find('td').filter(':odd').html('<a href="javascript:void()" class="button rmv">Remove</a>')
        $('#table2').append(it.outerHTML);
        $(it).find('td').filter(':odd').html('<input type=text> <a href="javascript:void()" class="button add">Add</a>')
        // $(it).remove();
    })
    $(document).on('click', '.rmv', function(){
        console.log(this.parentNode.parentNode.outerHTML);
        it=this.parentNode.parentNode;
        // $(it).find('td').filter(':odd').html('<a href="#" class="button">Qty</a> <a href="#" class="button add">Add</a>')
        // $('#table1').append(it.outerHTML);
        $(it).remove();
    })
    