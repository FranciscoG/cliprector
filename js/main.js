var box = document.getElementById("box");

var erector = {
  g1: document.querySelector('.g1'),
  g2: document.querySelector('.g2'),
  g3: document.querySelector('.g3'),
  g4: document.querySelector('.g4'),

  updateResult: function() {
    var result = document.querySelector('.language-css');
    result.innerHTML = this.img.style.cssText;
  },

  updatePos: function(src, pos) {
    // update clip rect
    switch (src) {
      case 'g1':
        // update clip stuff
        this.top = pos.y + (this.offset - 1);
        this.left = pos.x + (this.offset - 1);
        // make sure adjacent things are updated
        this.g2.style.top = pos.y + 'px';
        this.g3.style.left = pos.x + 'px';
        this.clipit();
        break;
      case 'g2':
        // update clip stuff
        this.top = pos.y + (this.offset - 1);
        this.right = pos.x + this.offset;
        // make sure adjacent things are updated
        this.g1.style.top = pos.y + 'px';
        this.g4.style.left = pos.x + 'px';
        this.clipit();
        break;
      case 'g3':
        // update clip stuff
        this.bottom = pos.y + this.offset;
        this.left = pos.x + (this.offset - 1);
        // make sure adjacent things are updated
        this.g1.style.left = pos.x + 'px';
        this.g4.style.top = pos.y + 'px';
        this.clipit();
        break;
      case 'g4':
        // update clip stuff
        this.bottom = pos.y + this.offset;
        this.right = pos.x + this.offset;
        // make sure adjacent things are updated
        this.g2.style.left = pos.x + 'px';
        this.g3.style.top = pos.y + 'px';
        this.clipit();
        break;
      default:
        break;
    }
    this.clipit();
  },

  onDragG1: function(instance, event, pointer) {
    console.log('dragMove on ' + event.type + ' position at ' + instance.position.x);
    erector.updatePos('g1', instance.position);
  },

  onDragG2: function(instance, event, pointer) {
    console.log('dragMove on ' + event.type + ' position at ' + instance.position.x);
    erector.updatePos('g2', instance.position);
  },

  onDragG3: function(instance, event, pointer) {
    console.log('dragMove on ' + event.type + ' position at ' + instance.position.y);
    erector.updatePos('g3', instance.position);
  },

  onDragG4: function(instance, event, pointer) {
    console.log('dragMove on ' + event.type + ' position at ' + instance.position.y);
    erector.updatePos('g4', instance.position);
  },

  dragG1: function() {
    var dG1 = new Draggabilly(this.g1, {
      containment: '#outer'
    });
    dG1.on('dragMove', this.onDragG1);
  },

  dragG2: function() {
    var dG2 = new Draggabilly(this.g2, {
      containment: '#outer'
    });
    dG2.on('dragMove', this.onDragG2);
  },

  dragG3: function() {
    var dG3 = new Draggabilly(this.g3, {
      containment: '#outer'
    });
    dG3.on('dragMove', this.onDragG3);
  },

  dragG4: function() {
    var dG4 = new Draggabilly(this.g4, {
      containment: '#outer'
    });
    dG4.on('dragMove', this.onDragG4);
  },

  clipit: function() {
    this.img.style.cssText = 'clip: rect(' + this.top + 'px ' + this.right + 'px ' + this.bottom + 'px ' + this.left + 'px )';
    this.updateResult();
  },

  setGuides2: function() {
    // set starting guides positons.
    // note: can't use css bottom and right because it breaks the draggable library
    var offset = 8;
    this.offset = offset;

    // g1: top/left, is set in the CSS

    // g2: top/right,  top is already set in CSS
    this.g2.style.left = (this.img.width - offset) + 'px';

    // g3: bottom/left, left is already set in CSS
    this.g3.style.top = (this.img.height - offset) + 'px';

    // g4: bottom/right, both need to be set here
    this.g4.style.top = (this.img.height - offset) + 'px';
    this.g4.style.left = (this.img.width - offset) + 'px';
  },

  init: function() {
    // make container match img size
    var _img = document.querySelector("#box img");
    this.img = _img;
    box.style.cssText = 'width: ' + _img.width + 'px; height: ' + _img.height + 'px; display: block;';

    // place initial clip guides
    this.setGuides2();

    this.top = 0;
    this.right = _img.width;
    this.bottom = _img.height;
    this.left = 0;
    this.clipit();

    // init the drag library
    this.dragG1();
    this.dragG2();
    this.dragG3();
    this.dragG4();
  }
};

/********************************************************
 * File Drag and Drop section
 */

var uploader = {

  previewfile: function(file) {
    var self = this;

    if (this.acceptedTypes[file.type] === true) {
      var reader = new FileReader();
      reader.onload = function(event) {
        var image = new Image();
        image.src = event.target.result;
        self.holder.style.display = "none";
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
    var holder = document.getElementById('pic_drop');
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
    }
  }
};

uploader.init();