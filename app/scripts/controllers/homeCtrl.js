'use strict'

angular.module('jsonxmleditorApp')
    .controller('homeCtrl', ['$scope', '$sce', '$http', function($scope, $sce, $http){
        $scope.obj={
            input :{},
            data: {},
            options:{
                mode: 'tree'
            },
            header: '',
            jsonTreeFlag: false,
            xmltojsonFlag: false,
            jsontoxmlFlag: false,
            irErrorLeftPanel: false,
            errorMessageLeftPanel: '',
            isErrorRightPanel: false,
            errorMessageRightPanel: '',
            actionList:[{
                name: 'JSON Tree',
                checked: true
            }, {
                name: 'XML Tree',
                checked: false,
            },{
                name: 'XMLToJSON',
                checked: false
            },{
                name: 'JSONToXML',
                checked: false
            }
            ],
            checked: false,
            aceLoaded: function(_editor){
                var session = _editor.getSession();
                var renderer = _editor.renderer;
                _session.setMode('ace/mode/xml');
            },
            copyMode: false,
            modeName: '',
            modeId: ''
        };

        (function($){
            $(".ripple-effect").click(function(e){
                var rippler = $(this);
                if(rippler.find(".ink").length == 0){
                    rippler.append("<span class='ink'></span>");
                }
                var ink = rippler.find(".ink");
                ink.removeClass("animate");
                if(!ink.height() && !ink.width()){
                    var d = Math.max(rippler.outerWidth(), rippler.outerHeight());
                    ink.css({height: d, width: d});
                }
                var x = e.pageX - rippler.offset().left - ink.width()/2;
                var y = e.pageY - rippler.offset().top - ink.height()/2;
                ink.css({
                    top: y + 'px',
                    left: x + 'px'
                }).addClass("animate");

            })
        })(jQuery);

        var onLoad = function(){
            $scope.obj.header = "JSON Tree";
            $scope.obj.jsonTreeFlag = true;
            $scope.obj.xmlTreeFlag = false;
        }
        onLoad();

        var toJsonTree = function(){
            try{
                $scope.obj.data = jsonlint.parse($scope.obj.input);
                $scope.obj.isErrorLeftPanel = false;
            } catch(e){
                if(e.message.indexOf('<') === -1){
                    $scope.obj.errorMessageLeftPanel = e.message;
                    $scope.obj.isErrorLeftPanel = true;
                } else{
                    $scope.obj.errorMessageLeftPanel = "Please provide appropriate JSON here not XML or change your action";
                    $scope.obj.isErrorLeftPanel = true;
                }
            }
        }

        var fromJsonTree = function(){
            $scope.obj.input = vkbeautify.json($scope.obj.data);
        }

        var fromXmlTree = function(){
            try{
                $scope.obj.input = vkbeautify.xml($scope.obj.data);
                $scope.obj.isErrorLeftPanel = false;
            } catch(e){
                $scope.obj.errorMessageLeftPanel = e;
                $scope.obj.isErrorLeftPanel = true;
            }
        }

        var transformResponsejson = function(cnv){
            var x2js = new X2JS();
            var aftCnv = x2js.xml_str2json(cnv);
            return aftCnv;
        }

        var transformResponsetoxml = function(cnv){
            try{
                var x2js = new X2JS();
                var aftCnv = x2js.json2xml_str(cnv);
                return aftCnv;
            } catch(e){
                $scope.obj.errorMessageLeftPanel = e;
                $scope.obj.isErrorLeftPanel = true;
            }
        }
        var toXmlTree = function(){
            try{
                $scope.obj.data = vkbeautify.xml($scope.obj.input);
                $scope.obj.isErrorLeftPanel =false;
            } catch(e){
                $scope.obj.errorMessageLeftPanel =e;
                $scope.obj.isErrorLeftPanel = true;
            }
        }

        $scope.updateSelection = function(position, actionList, name){
            $scope.obj.data = '';
            $scope.obj.input = '';
            $scope.obj.copyMode = false;
            angular.forEach(actionList, function(list, index){
                if(position != index){
                    list.checked = false;
                }
            });
            switch(name){
                case 'JSON Tree':
                    $scope.obj.header = 'JSON Tree';
                    $scope.obj.jsonTreeFlag = true;
                    $scope.obj.xmlTreeFlag = false;
                    $scope.obj.xmltojsonFlag = false;
                    $scope.obj.jsontoxmlFlag = false;
                    break;
                case 'XML Tree':
                    $scope.obj.header = 'XML Tree';
                    $scope.obj.jsonTreeFlag = false;
                    $scope.obj.xmlTreeFlag = true;
                    $scope.obj.xmltojsonFlag = false;
                    $scope.obj.jsontoxmlFlag = false;
                    break;
                case 'XMLToJSON':
                    $scope.obj.header = 'XMLToJSON Tree';
                    $scope.obj.modeName = 'Copy Mode';
                    $scope.obj.modeId = 'copyMode';
                    $scope.obj.jsonTreeFlag = false;
                    $scope.obj.xmlTreeFlag = false;
                    $scope.obj.xmltojsonFlag = true;
                    $scope.obj.jsontoxmlFlag = false;
                    break;
                case 'JSON Tree':
                    $scope.obj.header = 'JSONToXML Tree';
                    $scope.obj.jsonTreeFlag = true;
                    $scope.obj.xmlTreeFlag = false;
                    $scope.obj.xmltojsonFlag = false;
                    $scope.obj.jsontoxmlFlag = true;
                    break;
            }
        }

        $scope.onConvert = function(header){
            if(angular.equals($scope.obj.input, {}) || angular.equals($scope.obj.input, '')){
                $scope.obj.errorMessageLeftPanel = "Please enter input";
                $scope.obj.isErrorLeftPanel = true;
                return;
            }
            switch(header){
                case 'JSON Tree':
                    toJsonTree();
                    break;
                case 'XML Tree':
                    toXmlTree();
                    break;
                case 'XMLToJSON Tree':
                    xmlToJson();
                    break;
                case 'JSONToXML Tree':
                    jsonToXmml();
                    break;
            }
        }

        $scope.onInverse = function(header){
            switch(header){
                case 'JSON Tree':
                    fromJsonTree();
                    break;
                case 'XML Tree':
                    fromXmlTree();
                    breakl
                case 'XMLToJSON Tree':
                    fromjsonToXml();
                    break;
                case 'JSONToXML Tree':
                    fromxmlToJson();
                    break;
            }
        }

        var xmlToJson = function(){
            $scope.obj.modeName = 'Copy Mode';
            $scope.obj.modeId = 'copyMode';
            try{
                $scope.obj.data = transformResponsejson($scope.obj.input);
                if($scope.obj.data === null){
                    $scope.obj.errorMessageLeftPanel = "Please correct your input first.";
                    $scope.obj.isErrorLeftPanel = true;
                } else{
                    $scope.obj.isErrorLeftPanel = false;
                }
            } catch(e){
                $scope.obj.errorMessageLeftPanel = e;
                $scope.obj.isErrorLeftPanel = true;
            }
        }

        var jsonToXml = function(){
            try{
                var input = JSON.parse($scope.obj.input);
                $scope.obj.data = transformResponsetoxml(input);
                $scope.obj.data = vkbeautify.xml($scope.obj.data);
                $scope.obj.isError = false;
            } catch(e){
                if(e.message.indexOf('<') === -1){
                    $scope.obj.errorMessageLeftPanel = e.message;
                    $scope.obj.isErrorLeftPanel= true;
                } else{
                    $scope.obj.errorMessageLeftPanel = "Please provide appropriate JSON here not XML or Change your action";
                    $scope.obj.isErrorLeftPanel = false;
                }
            }
        }

        var fromxmlToJson = function(){
            try{
                $scope.obj.input = transformResponsejson($scope.obj.data);
                $scope.obj.input = transformResponsetoxml($scope.obj.input);
                $scope.obj.isError = false;
            } catch(e){
                $scope.obj.errorMessage = e;
                $scope.obj.isError = true;
            }
        }

        var fromjsonToXml = function(){
            try{
                if(typeof($scope.obj.data)=== 'string'){
                    $scope.obj.data = JSON.parse($scope.obj.data);
                }
                $scope.obj.input = transformResponsetoxml($scope.obj.data);
                $scope.obj.input = vkbeautify.xml($scope.obj.input);
                $scope.obj.isErrorLeftPanel = false;
            } catch(e){
                $scope.obj.errorMessageLeftPanel = e;
                $scope.obj.isErrorLeftPanel = true;
            }
        }

        $scope.updateDate = function(){
            $scope.obj.data = angular.toJson($scope.obj.data);
        }

        $scope.onChange = function(){
            if($scope.obj.input === ''){
                $scope.obj.isErrorLeftPanel = false;
            } else{
                $scope.obj.isErrorLeftPanel = false;
                switch($scope.obj.header){
                    case 'JSON Tree':
                        $scope.obj.input = vkbeautify.json($scope.obj.input);
                        break;
                    case 'XML Tree':
                        if($scope.obj.input.indexOf('<') === -1){
                            $scope.obj.errorMessageLeftPanel = "Please provide appropriate xml here not json or change your action";
                            $scope.obj.isErrorLeftPanel = true;
                        } else{
                            $scope.obj.input = vkbeautify.xml($scope.obj.input);
                        }
                        break;
                    case 'XMLToJSON Tree':
                        if($scope.obj.input.indexOf('<') === -1){
                            $scope.obj.errorMessageLeftPanel = "lease provide appropriate xml here not json or change your action";
                            $scope.obj.isErrorLeftPanel = true;
                        } else{
                            $scope.obj.input = vkbeautify.xml($scope.obj.input);
                        }
                        break;
                    case 'JSONToXML Tree':
                        $scope.obj.input = vkbeautify.json($scope.obj.input);
                        break;
                }
            }
        }

        $scope.onChangeRightPanel = function(){
            switch($scope.obj.header){
                case 'JSON Tree':
                    $scope.obj.data = vkbeautify.json($scope.obj.data);
                    break;
                case 'XML Tree':
                    $scope.obj.data = vkbeautify.xml($scope.obj.data);
                    break;
                case 'XMLToJSON Tree':
                    $scope.obj.data = vkbeautify.xml($scope.obj.data);
                    break;
                case 'JSONToXML Tree':
                    $scope.obj.data = vkbeautify.json($scope.obj.data);
                    break;
            }
        }

        $scope.onCopyMode = function(id){
            switch(id){
                case 'copyMode':
                    $scope.obj.data = vkbeautify.json($scope.obj.data);
                    $scope.obj.copyMode = true;
                    $scope.obj.modeName = 'Editor Mode';
                    $scope.obj.modeId = 'editorMode';
                    break;
                case 'editorMode':
                    $scope.obj.data = jsonlint.parse($scope.obj.data);
                    $scope.obj.modeName = 'Copy Mode';
                    $scope.obj.modeId = 'copyMode';
                    $scope.obj.copyMode = false;
                    break;

            }
        }

    }]);