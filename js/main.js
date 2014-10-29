var box = document.getElementById("box");

var erector = {
  // the guides at the four corners
  g1: document.getElementById('g1'),
  g2: document.getElementById('g2'),
  g3: document.getElementById('g3'),
  g4: document.getElementById('g4'),
  result: document.getElementById('codeResult'),

  updateResult: function() {
    this.result.innerHTML = this.img.style.cssText;
  },

  updatePos: function(src, pos) {
    // update clip rect
    switch (src) {
      case 'g1':
        // update clip region
        this.top = pos.y + (this.offset - 1);
        this.left = pos.x + (this.offset - 1);
        // make sure adjacent guides are updated
        this.g2.style.top = pos.y + 'px';
        this.g3.style.left = pos.x + 'px';
        this.clipit();
        break;
      case 'g2':
        // update clip region
        this.top = pos.y + (this.offset - 1);
        this.right = pos.x + this.offset;
        // make sure adjacent guides are updated
        this.g1.style.top = pos.y + 'px';
        this.g4.style.left = pos.x + 'px';
        this.clipit();
        break;
      case 'g3':
        // update clip region
        this.bottom = pos.y + this.offset;
        this.left = pos.x + (this.offset - 1);
        // make sure adjacent guides are updated
        this.g1.style.left = pos.x + 'px';
        this.g4.style.top = pos.y + 'px';
        this.clipit();
        break;
      case 'g4':
        // update clip region
        this.bottom = pos.y + this.offset;
        this.right = pos.x + this.offset;
        // make sure adjacent guides are updated
        this.g2.style.left = pos.x + 'px';
        this.g3.style.top = pos.y + 'px';
        this.clipit();
        break;
      default:
        break;
    }
    this.clipit();
  },

  drag: {},

  initDrag: function(elem, guide) {
    var _self = this;
    this.drag[guide] = new Draggabilly(elem, {
      containment: '#outer'
    });
    this.drag[guide].on('dragMove', function(instance, event, pointer) {
      _self.updatePos(guide, instance.position);
    });
  },

  clipit: function() {
    this.img.style.cssText = 'clip: rect(' + this.top + 'px ' + this.right + 'px ' + this.bottom + 'px ' + this.left + 'px )';
    this.updateResult();
  },

  setGuides: function() {
    // set starting guides positons.
    // note: can't use css bottom and right because it breaks the draggable library
    this.offset = 8;

    // g1: top/left
    // nothing to do here for g1, handled all in CSS

    // g2: top/right,  top is already set in CSS
    this.g2.style.left = (this.img.width - this.offset) + 'px';

    // g3: bottom/left, left is already set in CSS
    this.g3.style.top = (this.img.height - this.offset) + 'px';

    // g4: bottom/right, both need to be set here
    this.g4.style.top = (this.img.height - this.offset) + 'px';
    this.g4.style.left = (this.img.width - this.offset) + 'px';
  },

  init: function() {
    // make container match img size
    this.img = document.getElementById("clipImg");
    box.style.cssText = 'width: ' + this.img.width + 'px; height: ' + this.img.height + 'px; display: block;';

    // place initial clip guides
    this.setGuides();

    // set the initial clip rect() region to show the entire image
    this.top = 0;
    this.right = this.img.width;
    this.bottom = this.img.height;
    this.left = 0;
    this.clipit();

    // init the drag library on the guides
    this.initDrag(this.g1, 'g1');
    this.initDrag(this.g2, 'g2');
    this.initDrag(this.g3, 'g3');
    this.initDrag(this.g4, 'g4');

    // show the CSS results box
    document.getElementById('result').style.display = "block";
  }
};

/********************************************************
 * File Drag and Drop section
 */

var uploader = {

  previewfile: function(file) {
    if (this.acceptedTypes[file.type] === true) {
      var reader = new FileReader();
      reader.onload = function(event) {
        var image = new Image();
        image.src = event.target.result;
        image.id = "clipImg";
        document.getElementById('pic_drop').style.display = "none";
        box.appendChild(image);
        erector.init();
      };
      reader.readAsDataURL(file);
    } else {
      this.holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size / 1024 | 0) + 'K' : '') + '</p>';
      console.log(file);
    }
  },

  readfiles: function(files) {
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
      this.previewfile(files[i]);
    }
  },

  init: function() {
    var self = this;
    var holder = document.body;
    this.holder = holder;

    var dnd_test = 'draggable' in document.createElement('span');

    this.acceptedTypes = {
      'image/png': true,
      'image/jpeg': true,
      'image/gif': true
    };

    if (dnd_test) {
      holder.ondragover = function() {
        this.className = 'hover';
        return false;
      };
      holder.ondragend = function() {
        this.className = '';
        return false;
      };
      holder.ondrop = function(e) {
        this.className = '';
        e.preventDefault();
        self.readfiles(e.dataTransfer.files);
      };
    } else {
      console.warn('Drag and Drop API not supported by your browser');
    }
  }
};

uploader.init();