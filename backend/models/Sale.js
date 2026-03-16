const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
        required: [true, 'El álbum es requerido']
    },
    cantidad: {
        type: Number,
        required: [true, 'La cantidad es requerida'],
        min: [1, 'La cantidad mínima es 1']
    },
    precioUnitario: {
        type: Number,
        required: [true, 'El precio unitario es requerido'],
        min: [0, 'El precio no puede ser negativo']
    },
    total: {
        type: Number,
        required: true
    },
    vendidoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El vendedor es requerido']
    },
    notas: {
        type: String,
        trim: true,
        maxlength: [200, 'Las notas no pueden superar 200 caracteres']
    }
}, {
    timestamps: true
});

// Calcular total automáticamente antes de guardar
saleSchema.pre('save', function (next) {
    this.total = this.cantidad * this.precioUnitario;
    next();
});

module.exports = mongoose.model('Sale', saleSchema);
