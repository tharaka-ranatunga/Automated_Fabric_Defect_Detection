const api_repository = require('./../repositories/api.repository');

module.exports = {
    get_batch_names: async function(req,res){
        api_repository.get_batch_names(
            async function(status, message){
                return res.status(status).json(message);
            }
        )
    },

    start_capture: async function(req, res){
        api_repository.capture(
            true,
            async function(status, message){
                return res.status(status).json(message);
            }
        )
    },

    stop_capture: async function(req, res){
        api_repository.capture(
            false,
            async function(status, message){
                return res.status(status).json(message);
            }
        )
    },

    update_batch_folder: async function(req,res){
        api_repository.update_batch_folder(
            async function(status, message){
                return res.status(status).json(message);
            }
        );
    },

    create_batch: async function(req, res){
        if(typeof req.body==='undefined') {
            return res.status(400).json({message: 'body data is required'});}
        if(typeof req.body.data==='undefined' ||
            req.body.data===''){
            return res.status(400).json({message: 'data is required'});
        }
        api_repository.create_batch(
            req.body.data,
            async function(status, message){
                return res.status(status).json(message);
            }
        );
    },

    get_images : async function(req, res) {
        if(typeof req.query==='undefined') {
            return res.status(400).json({message: 'query data is required'});}
        if(typeof req.query.batch_name==='undefined' ||
            req.query.batch_name===''){
            return res.status(400).json({message: 'batch_name is required'});
        }
        api_repository.get_images(
            req.query.batch_name,
            async function (status, message) {
                return res.status(status).json(message);
            }
        );
    },

    upload_and_process : async function(req, res){
        if(typeof req.body==='undefined') {
            return res.status(400).json({message: 'body data is required'});}
        if(typeof req.body.encode_str==='undefined' ||
            req.body.encode_str===''){
            return res.status(400).json({message: 'encode_str is required'});
        }
        if(typeof req.body.file_name==='undefined' ||
            req.body.file_name===''){
            return res.status(400).json({message: 'file_name is required'});
        }
        if(typeof req.body.file_suffix==='undefined' ||
            req.body.file_suffix===''){
            return res.status(400).json({message: 'file_suffix is required'});
        }
        api_repository.upload_and_process(
            req.body.encode_str,
            req.body.file_name,
            req.body.file_suffix,
            async function (status, message, path, processed_path) {
                let data = {
                    path: path, processed_path: processed_path};
                io.emit('fabric_defect_server', data);
                return res.status(status).json(message);
            }
        );
    },

    decode_image: async function(req, res){
        if(typeof req.query==='undefined'){
            return res.status(400).json({message: 'query data is required'});}
        if(typeof req.query.image==='undefined' ||
            req.query.image===''){
            return res.status(400).json({message: 'image is required'});
        }

        api_repository.decode_image(
            req.query.image,
            await function(status, is_error, data){
                if(is_error){
                    return res.status(status).json(data);
                }else{
                    return res.status(200).sendFile(
                        'src/assets/images/tmp/image_decoded.jpg',
                        {root: './public'});
                }
            }
        )
    },

    sample_encode_str: async function(req, res){
        api_repository.sample_encode_str(
            async function(status, data){
                return res.status(status).json(data);
            }
        );
    }
};

