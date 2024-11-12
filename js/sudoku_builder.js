class GridShape {
  static MIN_SIZE = 1;
  static MAX_SIZE = 16;
  static isValidGridSize(size) {
    return Number.isInteger(size) && size >= this.MIN_SIZE && size <= this.MAX_SIZE;
  }

  static _registry = new Map();
  static _register(shape) {
    this._registry.set(shape.name, shape);
  }

  static fromGridSize(gridSize) {
    if (!this.isValidGridSize(gridSize)) return null;
    return this.get(this.makeName(gridSize));
  }
  static fromNumCells(numCells) {
    const gridSize = Math.sqrt(numCells);
    return this.fromGridSize(gridSize);
  }
  static fromNumPencilmarks(numPencilmarks) {
    const gridSize = Math.cbrt(numPencilmarks);
    if (!this.isValidGridSize(gridSize)) return null;
    return this.get(this.makeName(gridSize));
  }

  static makeName(gridSize) {
    return `${gridSize}x${gridSize}`;
  }

  constructor(gridSize) {
    this.gridSize = gridSize;
    [this.boxHeight, this.boxWidth] = this.constructor._boxDims(gridSize);
    this.numValues = gridSize;
    this.numCells = gridSize * gridSize;
    this.numPencilmarks = this.numCells * this.numValues;
    this.noDefaultBoxes = this.boxHeight === 1 || this.boxWidth === 1;

    this.name = this.constructor.makeName(gridSize);

    this._valueBase = this.numValues + 1;

    this.allCells = [];
    for (let i = 0; i < this.numCells; i++) this.allCells.push(i);

    this.maxSum = this.gridSize * (this.gridSize + 1) / 2;

    Object.freeze(this);
    this.constructor._register(this);
  }

  static _boxDims(gridSize) {
    for (let i = Math.sqrt(gridSize) | 0; i >= 1; i--) {
      if (gridSize % i === 0) {
        return [i, gridSize / i];
      }
    }
    throw ('Invalid grid size: ' + gridSize);
  }

  makeValueId = (cellIndex, n) => {
    const cellId = this.makeCellIdFromIndex(cellIndex);
    return `${cellId}_${n}`;
  }

  makeCellId = (row, col) => {
    return `R${(row + 1).toString(this._valueBase)}C${(col + 1).toString(this._valueBase)}`;
  }

  makeCellIdFromIndex = (i) => {
    return this.makeCellId(...this.splitCellIndex(i));
  }

  cellIndex = (row, col) => {
    return row * this.gridSize + col;
  }

  splitCellIndex = (cell) => {
    return [cell / this.gridSize | 0, cell % this.gridSize | 0];
  }

  parseValueId = (valueId) => {
    let [cellId, ...values] = valueId.split('_');
    return {
      values: values.map(v => parseInt(v)),
      cellId: cellId,
      ...this.parseCellId(cellId),
    };
  }

  parseCellId = (cellId) => {
    let row = parseInt(cellId[1], this._valueBase) - 1;
    let col = parseInt(cellId[3], this._valueBase) - 1;
    return {
      cell: this.cellIndex(row, col),
      row: row,
      col: col,
    };
  }

  getAdjacentCells = (cellId) => {
    let row = parseInt(cellId[1], this._valueBase) - 1;
    let col = parseInt(cellId[3], this._valueBase) - 1;
    let result = [];
    for (let dx = -1; dx < 2; dx++) {
      let x = col + dx;
      if (x < 0)
        continue;
      if (x >= this.gridSize)
        continue;
      for (let dy = -1; dy < 2; dy++) {
        let y = row + dy;
        if (y < 0)
          continue;
        if (y >= this.gridSize)
          continue;
        if (dx == 0 && dy == 0)
          continue;
        result.push(this.makeCellId(y, x));
      }
    }
    return result;
  }

  getOrthogonalCells = (cellId) => {
    let row = parseInt(cellId[1], this._valueBase) - 1;
    let col = parseInt(cellId[3], this._valueBase) - 1;
    let result = [];
    for (let dx = -1; dx < 2; dx+=2) {
      let x = col + dx;
      if (x < 0)
        continue;
      if (x >= this.gridSize)
        continue;
      result.push(this.makeCellId(row, x));
    }
    for (let dy = -1; dy < 2; dy+=2) {
      let y = row + dy;
      if (y < 0)
        continue;
      if (y >= this.gridSize)
        continue;
      result.push(this.makeCellId(y, col));
    }
    return result;
  }

  static get(name) {
    if (this._registry.has(name)) return this._registry.get(name);
    return this._makeFromGridSpec(name);
  }

  static _makeFromGridSpec(gridSpec) {
    const parts = gridSpec.split('x');
    const gridSize = parseInt(parts[0]);
    if (parts.length != 2 || parts[0] !== parts[1] ||
      gridSize.toString() !== parts[0]) {
      throw ('Invalid grid spec format: ' + gridSpec);
    }

    if (!this.isValidGridSize(gridSize)) {
      throw ('Invalid grid size: ' + gridSize);
    }

    return new GridShape(gridSize);
  }
}

const SHAPE_MAX = new GridShape(GridShape.MAX_SIZE);
const SHAPE_9x9 = GridShape.get('9x9');

class SudokuParser {
  static parseShortKillerFormat(text) {
    // Reference for format:
    // http://forum.enjoysudoku.com/understandable-snarfable-killer-cages-t6119.html

    const shape = SHAPE_9x9;
    const numCells = shape.numCells;
    const gridSize = shape.gridSize;

    if (text.length != numCells) return null;
    // Note: The second ` is just there so my syntax highlighter is happy.
    if (!text.match(/[<v>^`',`]/)) return null;
    if (!text.match(/^[0-9A-Za-j^<v>`'',.`]*$/)) return null;

    // Determine the cell directions.
    let cellDirections = [];
    for (let i = 0; i < numCells; i++) {
      switch (text[i]) {
        case 'v':
          cellDirections.push(i + gridSize);
          break;
        case '^':
          cellDirections.push(i - gridSize);
          break;
        case '<':
          cellDirections.push(i - 1);
          break;
        case '>':
          cellDirections.push(i + 1);
          break;
        case '`':
          cellDirections.push(i - gridSize - 1);
          break;
        case '\'':
          cellDirections.push(i - gridSize + 1);
          break;
        case ',':
          cellDirections.push(i + gridSize - 1);
          break;
        case '.':
          cellDirections.push(i + gridSize + 1);
          break;
        default:
          cellDirections.push(i);
      }
    }

    let cages = new Map();
    for (let i = 0; i < numCells; i++) {
      let cageCell = i;
      let count = 0;
      while (cellDirections[cageCell] != cageCell) {
        cageCell = cellDirections[cageCell];
        count++;
        if (count > gridSize) {
          throw ('Loop in Killer Sudoku input.');
        }
      }
      if (!cages.has(cageCell)) {
        let c = text[cageCell];
        let sum;
        if (c >= '0' && c <= '9') {
          sum = +c;
        } else if (c >= 'A' && c <= 'Z') {
          sum = c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
        } else if (c >= 'a' && c <= 'j') {
          sum = c.charCodeAt(0) - 'a'.charCodeAt(0) + 36;
        } else {
          // Not a valid cage, ignore.
          continue;
        }
        cages.set(cageCell, {
          sum: sum,
          cells: [],
        });
      }
      cages.get(cageCell).cells.push(shape.makeCellIdFromIndex(i));
    }

    let constraints = [];
    for (const config of cages.values()) {
      constraints.push(new SudokuConstraint.Cage(config.sum, ...config.cells));
    }
    return new SudokuConstraint.Set(constraints);
  }

  static parseLongKillerFormat(text) {
    // Reference to format definition:
    // http://www.sudocue.net/forum/viewtopic.php?f=1&t=519

    if (!text.startsWith('3x3:')) return null;

    const shape = SHAPE_9x9;
    const numCells = shape.numCells;

    let parts = text.split(':');
    if (parts[2] != 'k') return null;
    if (parts.length != numCells + 4) return null;

    let cages = new Map();
    for (let i = 0; i < numCells; i++) {
      let value = +parts[i + 3];
      let cageId = value % 256;
      let cageSum = value / 256 | 0;

      if (!cageSum) continue;

      if (!cages.has(cageId)) {
        cages.set(cageId, { sum: cageSum, cells: [] });
      }
      cages.get(cageId).cells.push(shape.makeCellIdFromIndex(i));
    }

    let constraints = [];
    if (parts[1] == 'd') {
      constraints.push(new SudokuConstraint.Diagonal(1));
      constraints.push(new SudokuConstraint.Diagonal(-1));
    }
    for (const config of cages.values()) {
      constraints.push(new SudokuConstraint.Cage(config.sum, ...config.cells));
    }
    return new SudokuConstraint.Set(constraints);
  }

  static shapeToBaseCharCode(shape) {
    return shape.numValues < 10 ? '1'.charCodeAt(0) : 'A'.charCodeAt(0);
  }

  static parsePlainSudoku(text) {
    const shape = GridShape.fromNumCells(text.length);
    if (!shape) return null;

    const numCells = shape.numCells;
    const gridSize = shape.gridSize;

    const baseCharCode = this.shapeToBaseCharCode(shape);
    if (!baseCharCode) return null;

    let fixedValues = [];
    let nonValueCharacters = [];
    for (let i = 0; i < numCells; i++) {
      let c = text.charCodeAt(i);
      if (c >= baseCharCode && c <= baseCharCode + gridSize - 1) {
        fixedValues.push(shape.makeValueId(i, c - baseCharCode + 1));
      } else {
        nonValueCharacters.push(c);
      }
    }
    if (new Set(nonValueCharacters).size > 1) return null;
    return new SudokuConstraint.Set([
      new SudokuConstraint.Shape(shape.name),
      ...SudokuConstraint.Given.makeFromArgs(...fixedValues),
    ]);
  }

  static parseJigsawLayout(text) {
    const shape = GridShape.fromNumCells(text.length);
    if (!shape) return null;

    const numCells = shape.numCells;
    const gridSize = shape.gridSize;

    const chars = new Set(text);
    if (chars.size != gridSize) return null;

    const counter = {};
    chars.forEach(c => counter[c] = 0);
    for (let i = 0; i < numCells; i++) {
      counter[text[i]]++;
    }

    if (Object.values(counter).some(c => c != gridSize)) return null;

    return new SudokuConstraint.Set([
      new SudokuConstraint.Shape(shape.name),
      ...SudokuConstraint.Jigsaw.makeFromArgs(text),
      new SudokuConstraint.NoBoxes(),
    ]);
  }

  static parseJigsaw(text) {
    if (text.length % 2 !== 0) return null;

    const shape = GridShape.fromNumCells(text.length / 2);
    if (!shape) return null;

    const numCells = shape.numCells;

    const layout = this.parseJigsawLayout(text.substr(numCells));
    if (layout == null) return null;

    const fixedValues = this.parsePlainSudoku(text.substr(0, numCells));
    if (fixedValues == null) return null;

    return new SudokuConstraint.Set([layout, fixedValues]);
  }

  static parseGridLayout(rawText) {
    // Only allow digits, dots, spaces and separators.
    if (rawText.search(/[^\d\s.|_-]/) != -1) return null;

    const parts = [...rawText.matchAll(/[.]|\d+/g)];
    const numParts = parts.length;

    const shape = GridShape.fromNumCells(numParts);
    if (!shape) return null;

    let fixedValues = [];
    for (let i = 0; i < numParts; i++) {
      const cell = parts[i];
      if (cell == '.') continue;
      fixedValues.push(shape.makeValueId(i, cell));
    }

    return new SudokuConstraint.Set([
      new SudokuConstraint.Shape(shape.name),
      ...SudokuConstraint.Given.makeFromArgs(...fixedValues),
    ]);
  }

  static parsePencilmarks(text) {
    const shape = GridShape.fromNumPencilmarks(text.length);
    if (!shape) return null;

    // Only allow digits, and dots.
    if (text.search(/[^\d.]/) != -1) return null;

    const numValues = shape.numValues;

    // Split into segments of 9 characters.
    const pencilmarks = [];
    for (let i = 0; i < shape.numCells; i++) {
      const cellId = shape.makeCellIdFromIndex(i);
      const values = (
        text.substr(i * numValues, numValues)
          .split('')
          .filter(c => c != '.')
          .join('_'));
      pencilmarks.push(`${cellId}_${values}`);
    }

    return new SudokuConstraint.Set([
      new SudokuConstraint.Shape(shape.name),
      ...SudokuConstraint.Given.makeFromArgs(...pencilmarks),
    ]);
  }

  static parseTextLine(rawText) {
    // Remove all whitespace.
    const text = rawText.replace(/\s+/g, '');

    let constraint;

    // Need this to void parsing this as a 1x1 grid.
    if (text.length === 1) return null;

    constraint = this.parseShortKillerFormat(text);
    if (constraint) return constraint;

    constraint = this.parseLongKillerFormat(text);
    if (constraint) return constraint;

    constraint = this.parseJigsaw(text);
    if (constraint) return constraint;

    constraint = this.parseJigsawLayout(text);
    if (constraint) return constraint;

    constraint = this.parsePlainSudoku(text);
    if (constraint) return constraint;

    constraint = this.parseGridLayout(rawText);
    if (constraint) return constraint;

    constraint = this.parsePencilmarks(text);
    if (constraint) return constraint;

    return null;
  }

  static parseText(rawText) {
    const constraints = [];
    // Parse sections separated by a blank line separately,
    // and then merge their constraints.
    for (const part of rawText.split(/\n\s*\n/)) {
      let constraint = this.parseTextLine(part);
      if (!constraint) {
        constraint = this.parseString(part);
      }
      constraints.push(constraint);
    }
    if (constraints.length == 1) return constraints[0];
    return new SudokuConstraint.Set(constraints);
  }

  static _resolveCompositeConstraints(revConstraints, compositeClass) {
    // NOTE: The constraints are reversed so we can efficiently pop them off the
    // end. The result will be that everything is in the original order.

    const items = [];

    while (revConstraints.length) {
      const c = revConstraints.pop();
      if (c.type === 'End') break;

      if (c.constructor.IS_COMPOSITE) {
        const resolvedComposite = this._resolveCompositeConstraints(
          revConstraints, c.constructor);
        if (compositeClass.CAN_ABSORB.includes(c.constructor.name)) {
          // We can directly add the sub-constraints to this composite.
          items.push(...resolvedComposite.constraints);
        } else {
          items.push(resolvedComposite);
        }
      } else {
        items.push(c);
      }
    }
    return new compositeClass(items);
  }

  static parseString(str) {
    str = str.replace(/\s+/g, '');
    let items = str.split('.');
    if (items[0]) throw (
      'Invalid constraint string: Constraint must start with a "."');
    items.shift();

    const constraints = [];
    for (const item of items) {
      const args = item.split('~');
      const type = args.shift() || SudokuConstraint.Given.name;
      const cls = SudokuConstraint[type];
      if (!cls) {
        throw ('Unknown constraint type: ' + type);
      }
      const constraintParts = [...cls.makeFromArgs(...args)];
      if (constraintParts.length > 1
        && CompositeConstraintBase.allowedConstraintClass(cls)) {
        // If this item was split into multiple constraints, then we wrap it
        // in an 'And' constraint, since they may need to be treated as a unit
        // when nested in an 'Or'.
        // We only need to do this for constraints that are allowed inside
        // composite constraints.
        constraints.push(
          new SudokuConstraint.And(),
          ...constraintParts,
          new SudokuConstraint.End());
      } else {
        constraints.push(...constraintParts);
      }
    }

    return this._resolveCompositeConstraints(
      constraints.reverse(), SudokuConstraint.Set);
  }

  static extractConstraintTypes(str) {
    const types = str.matchAll(/[.]([^.~]+)/g);
    const uniqueTypes = new Set();
    for (const type of types) {
      const value = type[1].trim();
      if (SudokuConstraint[value]) {
        uniqueTypes.add(value);
      }
    }
    return [...uniqueTypes];
  }
}

class CellArgs {
  constructor(args, type) {
    const numArgs = args.length;
    if (!numArgs) {
      throw ('No cells provided for ' + type);
    }

    this._isLoop = false;
    if (args[numArgs - 1] == 'LOOP') {
      if (!SudokuConstraint[type].LOOPS_ALLOWED) {
        throw ('Loops are not allowed for ' + type);
      }
      args.pop();
      this._isLoop = true;
    }

    this._cells = args;
  }

  isLoop() {
    return this._isLoop;
  }

  cells() {
    return this._cells;
  }

  cellIds(shape) {
    return this._cells.map(c => shape.parseCellId(c).cell);
  }
}

class SudokuConstraintBase {
  static DESCRIPTION = '';
  static CATEGORY = 'Experimental';
  static DISPLAY_CONFIG = null;
  static LOOPS_ALLOWED = false;
  static IS_COMPOSITE = false;
  // A puzzle can't have multiple constraints with the same
  // uniquenessKey. Uniqueness keys are specific to a constraint
  // type.
  // The UNIQUENESS_KEY_FIELD is a field that is used to generate the
  // uniqueness key for this constraint.
  // Use null if there are no uniqueness requirements.
  static UNIQUENESS_KEY_FIELD = null;

  // Determine if a list of cells is valid for this constraint class.
  // Used by LinesAndSets constraints. Takes (cells, shape) arguments.
  static VALIDATE_CELLS_FN = null;

  constructor(args) {
    this.args = args ? [...args] : [];
    this.type = this.constructor.name;
  }

  static *makeFromArgs(...args) {
    yield new this(...args);
  }

  // Generate a string for all the passed in constraints combined.
  // All constraints will be of the current type.
  // IMPORTANT: Serialize should not return more constraints than the input, as
  //            the output maybe included in an 'Or'.
  static serialize(constraints) {
    return constraints.map(
      c => this._argsToString(...c.args)).join('');
  }

  static _argsToString(...args) {
    let type = this.name;
    if (this == SudokuConstraint.Given) type = '';
    const arr = [type, ...args];
    return '.' + arr.join('~');
  }

  toString() {
    return this.constructor.serialize([this]);
  }

  forEachTopLevel(fn) {
    if (this.type === 'Set') {
      this.constraints.forEach(c => c.forEachTopLevel(fn));
    } else {
      fn(this);
    }
  }

  toMap() {
    const cMap = new MultiMap();

    this.forEachTopLevel(c => {
      cMap.add(c.type, c);
    });

    return cMap.getMap();
  }

  getShape() {
    let gridSpec = null;
    this.forEachTopLevel(c => {
      if (c.type === 'Shape') gridSpec = c.gridSpec;
    });

    const shape = SudokuConstraint.Shape.getShapeFromGridSpec(gridSpec);
    if (!shape) throw ('Unknown shape: ' + shape);
    return shape;
  }

  static displayName() {
    return this.name.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  chipLabel() {
    let label = this.constructor.displayName();
    if (this.constructor.CATEGORY === 'Experimental') {
      label += ' (Experimental)';
    }
    return label;
  }

  uniquenessKeys() {
    const field = this.constructor.UNIQUENESS_KEY_FIELD;
    if (field === null) return [];
    const key = this[field];
    return Array.isArray(key) ? key : [key];
  }

  // Get the cells associated with this constraints.
  // Mainly for display purposes.
  getCells(shape) {
    return this.cells || [];
  }

  static _makeRegions(fn, gridSize) {
    const regions = [];
    for (let r = 0; r < gridSize; r++) {
      const cells = [];
      for (let i = 0; i < gridSize; i++) {
        cells.push(fn(r, i));
      }
      regions.push(cells);
    }
    return regions;
  }

  static rowRegions = memoize((shape) => {
    const gridSize = shape.gridSize;
    return this._makeRegions((r, i) => r * gridSize + i, gridSize);
  });
  static colRegions = memoize((shape) => {
    const gridSize = shape.gridSize;
    return this._makeRegions((c, i) => i * gridSize + c, gridSize);
  });
  static boxRegions = memoize((shape) => {
    if (shape.noDefaultBoxes) return [];

    const gridSize = shape.gridSize;
    const boxWidth = shape.boxWidth;
    const boxHeight = shape.boxHeight;

    return this._makeRegions(
      (r, i) => ((r / boxHeight | 0) * boxHeight + (i % boxHeight | 0)) * gridSize
        + (r % boxHeight | 0) * boxWidth + (i / boxHeight | 0), gridSize);
  });
  static disjointSetRegions = memoize((shape) => {
    const gridSize = shape.gridSize;
    const boxWidth = shape.boxWidth;
    const boxHeight = shape.boxHeight;
    return this._makeRegions(
      (r, i) => ((i / boxHeight | 0) * boxHeight + (r % boxHeight | 0)) * gridSize
        + (i % boxHeight | 0) * boxWidth + (r / boxHeight | 0), gridSize);
  });
  static square2x2Regions = memoize((shape) => {
    const gridSize = shape.gridSize;
    const regions = [];

    for (let i = 0; i < gridSize - 1; i++) {
      for (let j = 0; j < gridSize - 1; j++) {
        regions.push([
          shape.cellIndex(i, j),
          shape.cellIndex(i, j + 1),
          shape.cellIndex(i + 1, j),
          shape.cellIndex(i + 1, j + 1),
        ]);
      }
    }

    return regions;
  });

  static fullLineCellMap = memoize((shape) => {
    let map = new Map();
    const gridSize = shape.gridSize;

    const rowRegions = this.rowRegions(shape);
    for (let row = 0; row < gridSize; row++) {
      const cells = rowRegions[row].map(c => shape.makeCellIdFromIndex(c));
      map.set(`R${row + 1},1`, cells);
      map.set(`R${row + 1},-1`, cells.slice().reverse());
    }
    const colRegions = this.colRegions(shape);
    for (let col = 0; col < gridSize; col++) {
      const cells = colRegions[col].map(c => shape.makeCellIdFromIndex(c));
      map.set(`C${col + 1},1`, cells);
      map.set(`C${col + 1},-1`, cells.slice().reverse());
    }

    return map;
  });

  static _cellsAreAdjacent(cells, shape) {
    if (cells.length != 2) return false;
    // Manhattan distance is exactly 1.
    let cell0 = shape.parseCellId(cells[0]);
    let cell1 = shape.parseCellId(cells[1]);
    return 1 == Math.abs(cell0.row - cell1.row) + Math.abs(cell0.col - cell1.col);
  }

  static _cellsAre2x2Square(cells, shape) {
    if (cells.length != 4) return false;
    cells = cells.map(
      c => shape.parseCellId(c)).sort((a, b) => a.cell - b.cell);
    let { row, col } = cells[0];
    return (
      (cells[1].row == row && cells[1].col == col + 1) &&
      (cells[2].row == row + 1 && cells[2].col == col) &&
      (cells[3].row == row + 1 && cells[3].col == col + 1));
  }
}

class LineOptions {
  color = 'rgb(200, 200, 200)';
  width = 5;
  startMarker;
  endMarker;
  nodeMarker;
  arrow = false;
  dashed = false;

  static DEFAULT_COLOR = 'rgb(200, 200, 200)';
  static THIN_LINE_WIDTH = 2;
  static THICK_LINE_WIDTH = 15;

  static FULL_CIRCLE_MARKER = 1;
  static EMPTY_CIRCLE_MARKER = 2;
  static SMALL_FULL_CIRCLE_MARKER = 3;
  static SMALL_EMPTY_CIRCLE_MARKER = 4;
  static DIAMOND_MARKER = 5;

  constructor(options) {
    Object.assign(this, options);
  }
}

class ShadedRegionOptions {
  labelField;
  pattern;

  static DIAGONAL_PATTERN = 'diagonal-pattern';
  static SQUARE_PATTERN = 'square-pattern';
  static CHECKERED_PATTERN = 'checked-pattern';

  constructor(options) {
    Object.assign(this, options);
  }
}

class OutsideConstraintBase extends SudokuConstraintBase {
  static CLUE_TYPE_DOUBLE_LINE = 'double-line';
  static CLUE_TYPE_DIAGONAL = 'diagonal';
  static CLUE_TYPE_SINGLE_LINE = 'single-line';

  static ZERO_VALUE_OK = false;
  static UNIQUENESS_KEY_FIELD = 'arrowId';
  static CLUE_TYPE = '';

  constructor(arrowId, value) {
    super(arguments);
    arrowId = arrowId.toUpperCase();

    this.arrowId = arrowId;
    this.value = parseInt(value);

    if (!Number.isInteger(this.value)) {
      throw Error('Invalid clue value: ' + value);
    }
    if (!this.constructor.ZERO_VALUE_OK && this.value === 0) {
      throw Error("Clue value can't be 0");
    }

    const idParts = arrowId.split(',');
    this.id = idParts[0];
    this.dir = idParts.length > 1 ? +idParts[1] : 0;
  }

  getCells(shape) {
    const cls = this.constructor;
    switch (cls.CLUE_TYPE) {
      case cls.CLUE_TYPE_DOUBLE_LINE:
        return cls.fullLineCellMap(shape).get(this.arrowId);
      case cls.CLUE_TYPE_DIAGONAL:
        return cls.cellMap(shape)[this.id];
      case cls.CLUE_TYPE_SINGLE_LINE:
        return cls.fullLineCellMap(shape).get(this.arrowId);
      default:
        throw Error('Unknown clue type');
    }
  }

  chipLabel() {
    if (this.constructor.CLUE_TYPE === this.constructor.CLUE_TYPE_DOUBLE_LINE) {
      const dir = this.dir;
      const arrowId = this.arrowId;

      let dirStr = '';
      if (arrowId[0] == 'C') {
        dirStr = dir > 0 ? '↓' : '↑';
      } else {
        dirStr = dir > 0 ? '→' : '←';
      }

      return `${this.constructor.displayName()} [${this.id} ${dirStr}${this.value}]`;
    } else {
      return super.chipLabel();
    }
  }

  static *makeFromArgs(...args) {
    switch (this.CLUE_TYPE) {
      case this.CLUE_TYPE_DOUBLE_LINE:
        const rowCol = args[0];
        if (args[1]) {
          yield new this(rowCol + ',1', args[1]);
        }
        if (args[2]) {
          yield new this(rowCol + ',-1', args[2]);
        }
        break;
      case this.CLUE_TYPE_DIAGONAL:
        yield new this(args[1], args[0]);
        break;
      case this.CLUE_TYPE_SINGLE_LINE:
        yield new this(args[1] + ',1', args[0]);
        break;
      default:
        throw Error('Unknown clue type');
    }
  }

  static serialize(constraints) {
    const clueType = this.CLUE_TYPE;

    if (clueType != this.CLUE_TYPE_DOUBLE_LINE) {
      return constraints.map(
        c => this._argsToString(c.value, c.id)).join('');
    }

    // Combine double line parts.
    const seenIds = new Map();
    for (const part of constraints) {
      const { id, arrowId, value } = part;
      let [_, dir] = arrowId.split(',');
      const index = dir === '1' ? 1 : 2;

      if (seenIds.has(id)) {
        seenIds.get(id)[index] = value;
      } else {
        const args = [id, '', ''];
        args[index] = value;
        seenIds.set(id, args);
      }
    }

    return [...seenIds.values()].map(
      args => this._argsToString(...args)).join('');
  }
}

class CompositeConstraintBase extends SudokuConstraintBase {
  static CATEGORY = 'Composite';
  static IS_COMPOSITE = true;
  static DISPLAY_CONFIG = {
    displayClass: 'BorderedRegion',
    opacity: 0.35,
    dashed: true,
  };

  // Create an allow-list for the types of constraints that can be inside a
  // composite.
  // Other types of constraints either:
  //  - Don't make sense to next inside one (such as Shape)
  //  - Interact with other constraints that make them difficult to implement
  //    such as StrictKropki or constraints that define regions.
  //  - Or would just be a bit confusing to include given the above two caveats
  //    (such as Anti-knight). It is easier to ban everything in the layout
  //    panel.
  static _ALLOWED_CATEGORIES = new Set(
    ['LinesAndSets', 'GivenCandidates', 'OutsideClue', 'Composite', 'CustomBinary']);

  static allowedConstraintClass(constraintClass) {
    return this._ALLOWED_CATEGORIES.has(constraintClass.CATEGORY);
  }

  constructor(constraints) {
    super(arguments);
    this.constraints = constraints || [];
    for (const c of this.constraints) {
      if (!this.constructor.allowedConstraintClass(c.constructor)) {
        throw Error(
          `Invalid constraint type in '${this.constructor.name}': ${c.type}`);
      }
    }
  }

  addChild(constraint) {
    this.constraints.push(constraint);
  }

  removeChild(constraint) {
    arrayRemoveValue(this.constraints, constraint);
  }

  getCells(shape) {
    return this.constraints.flatMap(c => c.getCells(shape));
  }

  static _isSingleConstraint(constraints, serialized) {
    // Check if we only had one constraint to serialize.
    // This handles nested composites.
    if (constraints.length === 1 && constraints[0].constraints.length === 1) {
      return true;
    }

    // Otherwise check if there is a new constraint that is started after the
    // first one.
    // This handles ordinary constraints which have been combined.
    if (serialized.length > 1 && serialized.indexOf('.', 1) === -1) {
      return true;
    }

    return false;
  }
}

class SudokuConstraint {

  static Set = class Set extends SudokuConstraintBase {
    static CATEGORY = null;
    static IS_COMPOSITE = true;
    static CAN_ABSORB = ['Set', 'And'];

    constructor(constraints) {
      super(arguments);
      this.constraints = constraints;
    }

    static serialize(constraints) {
      const constraintMap = new MultiMap();
      for (const c of constraints) {
        for (const cc of c.constraints) {
          constraintMap.add(cc.constructor, cc);
        }
      }

      const parts = [];
      for (const [cls, constraints] of constraintMap) {
        parts.push(cls.serialize(constraints));
      }
      return parts.join('');
    }

    getCells(shape) {
      return this.constraints.flatMap(c => c.cells(shape));
    }
  }

  static Or = class Or extends CompositeConstraintBase {
    static CAN_ABSORB = ['Or'];

    static _serializeSingle(constraint) {
      const parts = [];
      // We can't combine any constraints within an 'Or'.
      for (const c of constraint.constraints) {
        parts.push(c.constructor.serialize([c]));
      }

      const innerStr = parts.join('');
      if (this._isSingleConstraint([constraint], innerStr)) {
        return innerStr;
      }
      return `.${this.name}${innerStr}.End`;
    }

    static serialize(constraints) {
      return constraints.map(c => this._serializeSingle(c)).join('');
    }
  }

  static And = class And extends CompositeConstraintBase {
    static CAN_ABSORB = ['Set', 'And'];

    static serialize(constraints) {
      // For 'And' we can combine all the constraints.
      const constraintMap = new MultiMap();
      for (const c of constraints) {
        for (const cc of c.constraints) {
          constraintMap.add(cc.constructor, cc);
        }
      }

      const parts = [];
      for (const [cls, constraints] of constraintMap) {
        parts.push(cls.serialize(constraints));
      }

      const innerStr = parts.join('');
      if (this._isSingleConstraint(constraints, innerStr)) {
        return innerStr;
      }
      return `.${this.name}${innerStr}.End`;
    }
  }

  static End = class End extends SudokuConstraintBase { }

  static Jigsaw = class Jigsaw extends SudokuConstraintBase {
    static CATEGORY = 'Jigsaw';
    static DISPLAY_CONFIG = { displayClass: 'Jigsaw' };
    static UNIQUENESS_KEY_FIELD = 'cells';

    constructor(...cells) {
      super(arguments);
      this.cells = cells;
    }

    chipLabel() { return ''; }

    static *makeFromArgs(...args) {
      const grid = args[0];
      const shape = GridShape.fromNumCells(grid.length);
      if (!shape) throw Error('Invalid jigsaw regions');

      const map = new MultiMap();
      for (let i = 0; i < grid.length; i++) {
        map.add(grid[i], i);
      }

      for (const [_, region] of map) {
        if (region.length === shape.gridSize) {
          yield new this(
            ...region.map(c => shape.makeCellIdFromIndex(c)));
        }
      }
    }

    static serialize(parts) {
      if (!parts.length) return [];

      const shape = GridShape.fromGridSize(parts[0].cells.length);

      // Fill parts grid such that each cell has a reference to the part.
      const partsGrid = new Array(shape.numCells).fill(null);
      for (const part of parts) {
        for (const cellId of part.cells) {
          const { cell } = shape.parseCellId(cellId);
          partsGrid[cell] = part;
        }
      }

      // Create an indexMap by iterating the cells in order.
      // This ensures that we create a consistent index independent of the
      // order of the parts or cells inside the parts.
      const indexMap = new Map();
      const baseCharCode = SudokuParser.shapeToBaseCharCode(shape);
      partsGrid.forEach((part) => {
        // Create a new index when we first encounter a part.
        if (!indexMap.has(part)) {
          const char = String.fromCharCode(baseCharCode + indexMap.size);
          indexMap.set(part, char);
        }
      });

      const layoutStr = partsGrid.map(part => indexMap.get(part)).join('');

      return this._argsToString(layoutStr);
    }
  }

  static Thermo = class Thermo extends SudokuConstraintBase {
    static DESCRIPTION = (
      "Values must be in increasing order starting at the bulb.");
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'Thermo',
      color: 'rgb(220, 220, 220)',
      width: LineOptions.THICK_LINE_WIDTH,
      startMarker: LineOptions.FULL_CIRCLE_MARKER,
    };

    constructor(...cells) {
      super(arguments);
      this.cells = cells;
    }

    static fnKey = memoize((numValues) =>
      SudokuConstraint.Binary.fnToKey((a, b) => a < b, numValues)
    );

    static displayName() {
      return 'Thermometer';
    }
  }

  static Whisper = class Whisper extends SudokuConstraintBase {
    static DESCRIPTION = (
      "Adjacent values on the line must differ by at least the given difference.");
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'GenericLine',
      color: 'rgb(255, 200, 255)',
    };
    static ARGUMENT_CONFIG = {
      label: 'difference',
      default: 5,
    };


    constructor(difference, ...cells) {
      // German whisper lines omit the difference, so the
      // first argument is actually a cell
      if (difference != +difference) {
        cells.unshift(difference);
        difference = 5;
      }
      super(arguments);
      this.cells = cells;
      this.difference = +difference;
    }

    static fnKey = memoize((difference, numValues) =>
      SudokuConstraint.Binary.fnToKey(
        (a, b) => a >= b + difference || a <= b - difference,
        numValues)
    );

    chipLabel() {
      return `Whisper (${this.difference})`;
    }
  }

  static Renban = class Renban extends SudokuConstraintBase {
    static DESCRIPTION = (
      "Digits on the line must be consecutive and non-repeating, in any order.");
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'GenericLine',
      color: 'rgb(230, 190, 155)',
    };

    constructor(...cells) {
      super(arguments);
      this.cells = cells;
    }

    static fnKey = memoize((numCells, numValues) =>
      SudokuConstraint.BinaryX.fnToKey(
        (a, b) => Math.abs(a - b) < numCells && a != b,
        numValues)
    );
  }

  static Modular = class Modular extends SudokuConstraintBase {
    static DESCRIPTION = (
      `Every sequential group of 'mod' cells on a the line must have
       different values when taken modulo 'mod'.
       If mod = 3, then every group of three cells on the line must contain a
       digit from the group 147, one from 258, and one from 369.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'GenericLine',
      color: 'rgb(230, 190, 155)',
      dashed: true,
    };
    static ARGUMENT_CONFIG = {
      label: 'mod',
      default: 5,
    };

    constructor(mod, ...cells) {
      super(arguments);
      this.cells = cells;
      this.mod = mod;
    }

    static displayName() {
      return 'Modular Line';
    }

    chipLabel() {
      return `Modular (${this.mod})`;
    }

    static fnKey = memoize((mod, numValues) =>
      SudokuConstraint.BinaryX.fnToKey(
        (a, b) => (a % mod) != (b % mod),
        numValues)
    );
  }

  static Entropic = class Entropic extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Every sequential group of 3 cells on a the line must have different
      values from the groups {1,2,3}, {4,5,6}, and {7,8,9}.`)
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'GenericLine',
      color: 'rgb(255, 100, 255)',
      dashed: true,
    };

    constructor(...cells) {
      super(arguments);
      this.cells = cells;
    }

    static displayName() {
      return 'Entropic Line';
    }

    static fnKey = memoize((numValues) =>
      SudokuConstraint.BinaryX.fnToKey(
        (a, b) => (((a - 1) / 3) | 0) != (((b - 1) / 3) | 0),
        numValues)
    );
  }

  static RegionSumLine = class RegionSumLine extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Values on the line have an equal sum N within each
      box it passes through. If a line passes through the
      same box more than once, each individual segment of
      such a line within that box sums to N separately.

      If the grid has no boxes, then jigsaw regions are used instead.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'GenericLine',
      color: 'rgb(100, 200, 100)',
    };

    constructor(...cells) {
      super(arguments);
      this.cells = cells;
    }
  }

  static Between = class Between extends SudokuConstraintBase {
    static DESCRIPTION = (`
        Values on the line must be strictly between the values in the circles.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'GenericLine',
      color: 'rgb(200, 200, 255)',
      startMarker: LineOptions.EMPTY_CIRCLE_MARKER,
      endMarker: LineOptions.EMPTY_CIRCLE_MARKER
    };

    constructor(...cells) {
      super(arguments);
      this.cells = cells;
    }
  }

  static Lockout = class Lockout extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Values on the line must be not be between the values in the diamonds.
      The values in the diamonds must differ by the difference given.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'GenericLine',
      color: 'rgb(200, 200, 255)',
      startMarker: LineOptions.DIAMOND_MARKER,
      endMarker: LineOptions.DIAMOND_MARKER
    };
    static ARGUMENT_CONFIG = {
      label: 'min diff',
      default: 4,
    };

    constructor(minDiff, ...cells) {
      super(arguments);
      this.cells = cells;
      this.minDiff = minDiff;
    }

    static displayName() {
      return 'Lockout Line';
    }

    chipLabel() {
      return `Lockout (${this.minDiff})`;
    }
  }

  static Palindrome = class Palindrome extends SudokuConstraintBase {
    static DESCRIPTION = (`
      The values along the line form a palindrome.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'GenericLine',
      color: 'rgb(200, 200, 255)',
    };

    constructor(...cells) {
      super(arguments);
      this.cells = cells;
    }

    static fnKey = memoize((numValues) =>
      SudokuConstraint.Binary.fnToKey((a, b) => a == b, numValues)
    );
  }

  static Zipper = class Zipper extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Digits which are equal distance from the center of the zipper have the
      same sum. For odd length lines, the center digit is the sum.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'GenericLine',
      color: 'rgb(180, 180, 255)',
      dashed: true,
    };

    constructor(...cells) {
      super(arguments);
      this.cells = cells;
    }
  }

  static SumLine = class SumLine extends SudokuConstraintBase {
    static DESCRIPTION = (`
      The line can be divided into segments that each sum to the given sum.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'GenericLine',
      color: 'rgb(100, 200, 100)',
      dashed: true,
    };
    static ARGUMENT_CONFIG = {
      label: 'sum',
      default: 10,
    };

    static LOOPS_ALLOWED = true;

    constructor(sum, ...cells) {
      super(arguments);
      this.cells = cells;
      this.sum = sum;
    }

    chipLabel() {
      return `Sum Line (${this.sum})`;
    }
  }

  static NoBoxes = class NoBoxes extends SudokuConstraintBase {
    static DESCRIPTION = (`
      No standard box regions.`);
    static CATEGORY = 'LayoutCheckbox';
    static DISPLAY_CONFIG = { displayClass: 'DefaultRegionsInverted' };
    static UNIQUENESS_KEY_FIELD = 'type';
  }

  static StrictKropki = class StrictKropki extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Only explicitly marked cell pairs satisfy Kropki (black/white dot)
      constraints.`);
    static CATEGORY = 'GlobalCheckbox';
    static UNIQUENESS_KEY_FIELD = 'type';

    static fnKey = memoize((numValues) =>
      SudokuConstraint.Binary.fnToKey(
        (a, b) => a != b * 2 && b != a * 2 && b != a - 1 && b != a + 1,
        numValues)
    );
  }
  static StrictXV = class StrictXV extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Only explicitly marked cell pairs satisfy XV constraints.`);
    static CATEGORY = 'GlobalCheckbox';
    static UNIQUENESS_KEY_FIELD = 'type';

    static fnKey = memoize((numValues) =>
      SudokuConstraint.Binary.fnToKey(
        (a, b) => a + b != 5 && a + b != 10,
        numValues)
    );
  }
  static Shape = class Shape extends SudokuConstraintBase {
    static CATEGORY = 'Shape';
    static UNIQUENESS_KEY_FIELD = 'type';
    static DEFAULT_SHAPE = SHAPE_9x9;

    constructor(gridSpec) {
      super(arguments);
      this.gridSpec = gridSpec;
    }

    static serialize(constraints) {
      if (constraints.length != 1) {
        throw Error('Only one Shape constraint is allowed');
      }
      if (constraints[0].gridSpec === this.DEFAULT_SHAPE.name) {
        return '';
      }

      return super.serialize(constraints);
    }

    static getShapeFromGridSpec(gridSpec) {
      if (!gridSpec) return this.DEFAULT_SHAPE;
      return GridShape.get(gridSpec);
    }
  }

  static Windoku = class Windoku extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Values in the 3x3 windoku boxes must be uniques.`);
    static CATEGORY = 'LayoutCheckbox';
    static DISPLAY_CONFIG = { displayClass: 'Windoku' };
    static UNIQUENESS_KEY_FIELD = 'type';

    static regions = memoize((shape) => {
      const gridSize = shape.gridSize;
      const boxWidth = shape.boxWidth;
      const boxHeight = shape.boxHeight;

      const regions = [];

      for (let i = 1; i + boxWidth < gridSize; i += boxWidth + 1) {
        for (let j = 1; j + boxHeight < gridSize; j += boxHeight + 1) {
          const cells = [];
          for (let k = 0; k < gridSize; k++) {
            const row = j + (k % boxHeight | 0);
            const col = i + (k / boxHeight | 0);
            cells.push(shape.cellIndex(row, col));
          }
          regions.push(cells);
        }
      }

      return regions;
    });
  }

  static DisjointSets = class DisjointSets extends SudokuConstraintBase {
    static DESCRIPTION = (`
      No digit may appear in the same position in any two boxes.`);
    static CATEGORY = 'LayoutCheckbox';
    static UNIQUENESS_KEY_FIELD = 'type';
  }

  static AntiKnight = class AntiKnight extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Cells which are a knight's move away cannot have the same value.`);
    static CATEGORY = 'LayoutCheckbox';
    static UNIQUENESS_KEY_FIELD = 'type';

    static displayName() {
      return 'Anti-Knight';
    }
  }

  static AntiKing = class AntiKing extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Cells which are a king's move away cannot have the same value.`);
    static CATEGORY = 'LayoutCheckbox';
    static UNIQUENESS_KEY_FIELD = 'type';

    static displayName() {
      return 'Anti-King';
    }
  }

  static AntiTaxicab = class AntiTaxicab extends SudokuConstraintBase {
    static DESCRIPTION = (`
      A cell that contains a digit x can't have a taxicab distance of

      exactly x from another cell with the digit x.
      A taxicab distance from cell A to cell B is the minimum
      possible distance from cell A to cell B when traversed only through
      adjacent cells.`);
    static CATEGORY = 'GlobalCheckbox';
    static UNIQUENESS_KEY_FIELD = 'type';

    static displayName() {
      return 'Anti-Taxicab';
    }

    static taxicabCells(row, col, dist, shape) {
      const cells = [];
      const gridSize = shape.gridSize;

      for (let r = 0; r < gridSize; r++) {
        const rDist = Math.abs(r - row);
        if (rDist === 0 || rDist >= dist) continue;

        const cDist = dist - rDist;
        if (col - cDist >= 0) {
          cells.push(shape.cellIndex(r, col - cDist));
        }
        if (col + cDist < gridSize) {
          cells.push(shape.cellIndex(r, col + cDist));
        }
      }

      return cells;
    }
  }

  static AntiConsecutive = class AntiConsecutive extends SudokuConstraintBase {
    static DESCRIPTION = (`
      No adjacent cells can have consecutive values.`);
    static CATEGORY = 'GlobalCheckbox';
    static UNIQUENESS_KEY_FIELD = 'type';

    static fnKey = memoize((numValues) =>
      SudokuConstraint.Binary.fnToKey(
        (a, b) => (a != b + 1 && a != b - 1 && a != b),
        numValues)
    );

    static displayName() {
      return 'Anti-Consecutive';
    }
  }

  static GlobalEntropy = class GlobalEntropy extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Each 2x2 box in the grid has to contain a low digit (1, 2, 3),
      a middle digit (4, 5, 6) and a high digit (7, 8, 9).`);
    static CATEGORY = 'GlobalCheckbox';
    static UNIQUENESS_KEY_FIELD = 'type';
  }

  static GlobalMod = class GlobalMod extends SudokuConstraintBase {
    // NOTE: This is just called GlobalMod so it can be expanded to other
    //       moduli in backward-compatible way.
    static DESCRIPTION = (`
      Each 2x2 box in the grid has to contain a digit from (1, 4, 7),
      a digit from (2, 5, 8) and a digit from (3, 6, 9).`);
    static CATEGORY = 'GlobalCheckbox';
    static UNIQUENESS_KEY_FIELD = 'type';

    static displayName() {
      return 'Global Mod 3';
    }
  }

  static Diagonal = class Diagonal extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Values along the diagonal must be unique.`);
    static CATEGORY = 'LayoutCheckbox';
    static DISPLAY_CONFIG = { displayClass: 'Diagonal' };
    static ARGUMENT_CONFIG = {
      options: [
        { value: 1, text: '╱' },
        { value: -1, text: '╲' },
      ],
    };
    static UNIQUENESS_KEY_FIELD = 'direction';

    constructor(direction) {
      super(arguments);
      this.direction = +direction;
    }
  }

  static WhiteDot = class WhiteDot extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Kropki white dot: values must be consecutive. Adjacent cells only."`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'Dot',
      color: 'white',
    };
    static VALIDATE_CELLS_FN = this._cellsAreAdjacent;

    constructor(...cells) {
      super(arguments);
      this.cells = cells;
    }

    static fnKey = memoize((numValues) =>
      SudokuConstraint.Binary.fnToKey(
        (a, b) => a == b + 1 || a == b - 1,
        numValues)
    );

    static displayName() {
      return '○ ±1';
    }

    chipLabel() {
      return `○ [${this.cells}]`;
    }
  }

  static BlackDot = class BlackDot extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Kropki black dot: one value must be double the other. Adjacent cells only.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'Dot',
      color: 'black',
    };
    static VALIDATE_CELLS_FN = this._cellsAreAdjacent;

    constructor(...cells) {
      super(arguments);
      this.cells = cells;
    }

    static displayName() {
      return '● ×÷2';
    }

    chipLabel() {
      return `● [${this.cells}]`;
    }

    static fnKey = memoize((numValues) =>
      SudokuConstraint.Binary.fnToKey(
        (a, b) => a == b * 2 || b == a * 2,
        numValues)
    );
  }

  static Comparison = class Comparison extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Comparison: compare value between adjacent cells.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'Comparison',
    };
    static ARGUMENT_CONFIG = {
      label: "mode",
      options: [
        { value: '1', text: 'Maximum' },
        { value: '-1', text: 'Minimum' },
      ],
    };
    
    static VALIDATE_CELLS_FN = ([primary, ...secondaries], shape) => {
      if (!secondaries.length)
        return false;
      for (let secondary of secondaries) {
        if (!this._cellsAreAdjacent([primary, secondary], shape))
          return false;
      }
      return true;
    }

    constructor(mode, primaryCell, ...secondaryCells) {
      secondaryCells.sort();
      super([mode, primaryCell, ...secondaryCells]);
      this.mode = +mode;
      this.primaryCell = primaryCell;
      this.secondaryCells = secondaryCells;
    }

    static displayName() {
      return 'Comparison'
    }

    _symbol() {
      switch (this.mode) {
      case 1:
        return '>';
      case -1:
        return '<';
      default:
        throw new Error("Invalid state")
      }
    }
    chipLabel() {
      return `${this.primaryCell} ${this._symbol()} [${this.secondaryCells}]`;
    }

    static fnKey = memoize((mode, numValues) =>
      SudokuConstraint.Binary.fnToKey((a, b) => (mode < 0) ? (a < b) : (a > b), numValues)
    );

  }

  static X = class X extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Values must add to 10. Adjacent cells only.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'Letter',
    };
    static VALIDATE_CELLS_FN = this._cellsAreAdjacent;

    constructor(...cells) {
      super(arguments);
      this.cells = cells;
    }

    static displayName() {
      return 'X: 10Σ';
    }

    chipLabel() {
      return `X [${this.cells}]`;
    }
  }

  static ValueIndexing = class ValueIndexing extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Arrows point from a cell with digit X towards the same digit X,
      where the digit in the second cell on the line indicates how many cells
      away the digit X is on the line.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'GenericLine',
      startMarker: LineOptions.SMALL_FULL_CIRCLE_MARKER,
      arrow: true,
      dashed: true,
    };
    static VALIDATE_CELLS_FN = (cells, shape) => cells.length > 2;

    constructor(...cells) {
      super(arguments);
      this.cells = cells;
    }
  }


  static V = class V extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Values must add to 5. Adjacent cells only.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'Letter',
    };
    static VALIDATE_CELLS_FN = this._cellsAreAdjacent;

    constructor(...cells) {
      super(arguments);
      this.cells = cells;
    }

    static displayName() {
      return 'V: 5Σ';
    }

    chipLabel() {
      return `V [${this.cells}]`;
    }
  }

  static Arrow = class Arrow extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Values along the arrow must sum to the value in the circle.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'GenericLine',
      startMarker: LineOptions.EMPTY_CIRCLE_MARKER,
      arrow: true
    };

    constructor(...cells) {
      super(arguments);
      this.cells = cells;
    }
  }

  static DoubleArrow = class DoubleArrow extends SudokuConstraintBase {
    static DESCRIPTION = (`
      The sum of the values along the line equal the sum of the values in the
      circles.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'GenericLine',
      startMarker: LineOptions.EMPTY_CIRCLE_MARKER,
      endMarker: LineOptions.EMPTY_CIRCLE_MARKER
    };
    static VALIDATE_CELLS_FN = (cells, shape) => cells.length > 2;

    constructor(...cells) {
      super(arguments);
      this.cells = cells;
    }
  }

  static PillArrow = class PillArrow extends SudokuConstraintBase {
    static DESCRIPTION = (`
      The sum of the values along the line equal the 2-digit or 3-digit
      number in the pill.
      Numbers in the pill are read from left to right, top to bottom.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'PillArrow',
    };
    static ARGUMENT_CONFIG = {
      options: [
        { value: 2, text: '2-digit' },
        { value: 3, text: '3-digit' },
      ],
    };
    static VALIDATE_CELLS_FN = (cells, shape) => cells.length > 2;

    constructor(pillSize, ...cells) {
      super(arguments);
      this.pillSize = +pillSize;
      this.cells = cells;
    }

    chipLabel() {
      return `Pill Arrow (${this.pillSize}-digit)`;
    }
  }

  static Cage = class Cage extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Values must add up to the given sum. All values must be unique.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'ShadedRegion',
      labelField: 'sum',
    };
    static ARGUMENT_CONFIG = {
      label: 'sum',
    };
    static VALIDATE_CELLS_FN = (cells, shape) => (
      cells.length <= shape.numValues && cells.length > 1);

    constructor(sum, ...cells) {
      super(arguments);
      this.cells = cells;
      this.sum = sum;
    }

    chipLabel() {
      return `Cage (${this.sum})`;
    }

    static validateCells(cells, shape) {
      cells.length <= shape.numValues && cells.length > 1;
    }
  }

  static Sum = class Sum extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Values must add up to the given sum.
      Values don't need to be unique (use 'Cage' for uniqueness).`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'ShadedRegion',
      pattern: ShadedRegionOptions.CHECKERED_PATTERN,
      labelField: 'sum',
    };
    static ARGUMENT_CONFIG = {
      label: 'sum',
    };

    constructor(sum, ...cells) {
      super(arguments);
      this.cells = cells;
      this.sum = sum;
    }

    chipLabel() {
      return `Sum (${this.sum})`;
    }
  }

  static LittleKiller = class LittleKiller extends OutsideConstraintBase {
    static DESCRIPTION = (`
      Values along diagonal must add to the given sum. Values may repeat.`);
    static CATEGORY = 'OutsideClue';
    static DISPLAY_CONFIG = {
      displayClass: 'OutsideClue',
      clueTemplate: '$CLUE',
    };
    static CLUE_TYPE = OutsideConstraintBase.CLUE_TYPE_DIAGONAL;

    chipLabel() {
      return `Little Killer (${this.value})`;
    }

    static cellMap = memoize((shape) => {
      let map = {};
      const gridSize = shape.gridSize;

      const addLittleKiller = (row, col, dr, dc) => {
        let cells = [];
        for (; row >= 0 && col >= 0 && col < gridSize && row < gridSize;
          row += dr, col += dc) {
          cells.push(shape.makeCellId(row, col));
        }
        if (cells.length > 1) map[cells[0]] = cells;
      };

      // Left side.
      for (let row = 0; row < gridSize - 1; row++) addLittleKiller(row, 0, 1, 1);
      // Right side.
      for (let row = 1; row < gridSize - 1; row++) addLittleKiller(row, gridSize - 1, -1, -1);
      // Top side.
      for (let col = 1; col < gridSize; col++) addLittleKiller(0, col, 1, -1);
      // Bottom side.
      for (let col = 1; col < gridSize - 1; col++) addLittleKiller(gridSize - 1, col, -1, 1);

      return map;
    });
  }

  static XSum = class XSum extends OutsideConstraintBase {
    static DESCRIPTION = (`
      The sum of the first X numbers must add up to the given sum.
      X is the number in the first cell in the direction of the row or
      column.`);
    static CATEGORY = 'OutsideClue';
    static DISPLAY_CONFIG = {
      displayClass: 'OutsideClue',
      clueTemplate: '⟨$CLUE⟩',
    };
    static CLUE_TYPE = OutsideConstraintBase.CLUE_TYPE_DOUBLE_LINE;

    static displayName() {
      return 'X-Sum';
    }
  }

  static Sandwich = class Sandwich extends OutsideConstraintBase {
    static DESCRIPTION = (`
      Values between the 1 and the 9 in the row or column must add to the
      given sum.`);
    static CATEGORY = 'OutsideClue';
    static DISPLAY_CONFIG = {
      displayClass: 'OutsideClue',
      clueTemplate: '$CLUE',
    };
    static CLUE_TYPE = OutsideConstraintBase.CLUE_TYPE_SINGLE_LINE;
    static ZERO_VALUE_OK = true;

    chipLabel() {
      return `Sandwich [${this.id} ${this.value}]`;
    }
  }

  static Lunchbox = class Lunchbox extends SudokuConstraintBase {
    static DESCRIPTION = (`
      The numbers sandwiched between the smallest number and the largest
      number of the lunchbox adds up to the given sum. Numbers must be
      distinct.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'ShadedRegion',
      lineConfig: { color: 'rgba(100, 100, 100, 0.2)' },
      labelField: 'sum',
    };
    static ARGUMENT_CONFIG = {
      label: 'sum',
      default: 0,
    };

    constructor(sum, ...cells) {
      super(arguments);
      this.cells = cells;
      this.sum = sum;
    }

    chipLabel() {
      return `Lunchbox (${this.sum})`;
    }
  }

  static Skyscraper = class Skyscraper extends OutsideConstraintBase {
    static DESCRIPTION = (`
      Digits in the grid represent skyscrapers of that height.
      Higher skyscrapers obscure smaller ones.
      Clues outside the grid show the number of visible skyscrapers in that
      row / column from the clue's direction of view.`);
    static CATEGORY = 'OutsideClue';
    static DISPLAY_CONFIG = {
      displayClass: 'OutsideClue',
      clueTemplate: '[$CLUE]',
    };
    static CLUE_TYPE = OutsideConstraintBase.CLUE_TYPE_DOUBLE_LINE;
  }

  static HiddenSkyscraper = class HiddenSkyscraper extends OutsideConstraintBase {
    static DESCRIPTION = (`
      Digits in the grid represent skyscrapers of that height.
      Higher skyscrapers obscure smaller ones.
      Clues outside the grid show the first hidden skyscraper in that
      row/column from the clue's direction of view.`);
    static CATEGORY = 'OutsideClue';
    static DISPLAY_CONFIG = {
      displayClass: 'OutsideClue',
      clueTemplate: '|$CLUE|',
    };
    static CLUE_TYPE = OutsideConstraintBase.CLUE_TYPE_DOUBLE_LINE;
  }

  static NumberedRoom = class NumberedRoom extends OutsideConstraintBase {
    static DESCRIPTION = (`
      Clues outside the grid indicate the digit which has to be placed in
      the Nth cell in the corresponding direction, where N is the digit
      placed in the first cell in that direction.`);
    static CATEGORY = 'OutsideClue';
    static DISPLAY_CONFIG = {
      displayClass: 'OutsideClue',
      clueTemplate: ':$CLUE:',
    };
    static CLUE_TYPE = OutsideConstraintBase.CLUE_TYPE_DOUBLE_LINE;
  }

  static FullRank = class FullRank extends OutsideConstraintBase {
    static DESCRIPTION = (`
      Considering all rows and columns as numbers read from the direction
      of the clue and ranked from lowest (1) to highest, a clue represents
      where in the ranking that row/column lies.`);
    static CATEGORY = 'OutsideClue';
    static DISPLAY_CONFIG = {
      displayClass: 'OutsideClue',
      clueTemplate: '#$CLUE',
    };
    static CLUE_TYPE = OutsideConstraintBase.CLUE_TYPE_DOUBLE_LINE;
  }

  static AllDifferent = class AllDifferent extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Values must be unique.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'ShadedRegion',
    };

    constructor(...cells) {
      super(arguments);
      this.cells = cells;
    }
  }

  static ContainAtLeast = class ContainAtLeast extends SudokuConstraintBase {
    static DESCRIPTION = (`
      The comma-separated values must be present in the selected squares.
      If value is must be contained at least as many times as is
      repeated in the list.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'ShadedRegion',
      pattern: ShadedRegionOptions.DIAGONAL_PATTERN,
      labelField: 'valueStr',
    };
    static ARGUMENT_CONFIG = {
      label: 'values',
    };

    constructor(values, ...cells) {
      super(arguments);
      this.cells = cells;
      this.values = values;
      this.valueStr = values.replace(/_/g, ',');
    }

    chipLabel() {
      return `ContainAtLeast (${this.valueStr})`;
    }
  }

  static ContainExact = class ContainExact extends SudokuConstraint.ContainAtLeast {
    static DESCRIPTION = (`
      The comma-separated values must be present in the selected squares.
      If value is must be contained exactly as many times as is
      repeated in the list.`);

    chipLabel() {
      return `ContainExact (${this.valueStr})`;
    }
  };

  static SameValues = class SameValues extends SudokuConstraintBase {
    static DESCRIPTION = (`
      The cells are taken as a series of sets of the same size.
      Each set must contain the same values, including counts if values are
      repeated.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'BorderedRegion',
      splitFn: (constraint) => constraint.splitCells(),
    };
    static ARGUMENT_CONFIG = {
      label: 'num sets',
      default: 2,
      options: (cells) => {
        const options = [];
        for (let i = 2; i <= cells.length; i++) {
          if (cells.length % i == 0) {
            options.push({ text: `${i} sets`, value: i });
          }
        }
        return options;
      },
    };

    constructor(numSets, ...cells) {
      super(arguments);
      this.cells = cells;
      this.numSets = numSets;
    }

    static displayName() {
      return 'Same Value Sets';
    }

    chipLabel() {
      return `Same Value Sets (${this.numSets} sets)`;
    }

    splitCells() {
      const setSize = this.cells.length / this.numSets;
      if (!Number.isInteger(setSize)) {
        throw ('Number of cells must be a multiple of the number of sets');
      }
      const sets = [];
      for (let i = 0; i < this.numSets; i++) {
        sets.push(this.cells.slice(i * setSize, (i + 1) * setSize));
      }
      return sets;
    }

    static fnKey = memoize((numValues) => {
      return SudokuConstraint.Binary.fnToKey((a, b) => a == b, numValues);
    });
  }

  static Quad = class Quad extends SudokuConstraintBase {
    static DESCRIPTION = (`
      All the given values must be present in the surrounding 2x2 square.
      Select a 2x2 square to enable.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'Quad',
    };
    static ARGUMENT_CONFIG = {
      label: 'values',
    };
    static VALIDATE_CELLS_FN = this._cellsAre2x2Square;
    static UNIQUENESS_KEY_FIELD = 'topLeftCell';

    constructor(topLeftCell, ...values) {
      super(arguments);
      this.topLeftCell = topLeftCell;
      this.values = values;
    }

    chipLabel() {
      return `Quad (${this.values.join(',')})`;
    }

    static cells(topLeftCell) {
      const shape = SHAPE_MAX;
      const { row, col } = shape.parseCellId(topLeftCell);
      return [
        topLeftCell,
        shape.makeCellId(row, col + 1),
        shape.makeCellId(row + 1, col),
        shape.makeCellId(row + 1, col + 1),
      ];
    }

    getCells(shape) {
      return this.constructor.cells(this.topLeftCell);
    }
  }

  static Binary = class Binary extends SudokuConstraintBase {
    static CATEGORY = 'CustomBinary';
    static DISPLAY_CONFIG = {
      displayClass: 'CustomBinary',
      startMarker: LineOptions.SMALL_EMPTY_CIRCLE_MARKER,
    };

    constructor(key, name, ...cells) {
      super(arguments);
      this.key = key;
      this.name = name;
      this.cells = cells;
    }

    groupId() {
      return `${this.type}-${this.key}`;
    }

    chipLabel() {
      if (this.name) return `"${this.name}"`;
      return 'Custom';
    }

    static serialize(constraints) {
      const parts = [];

      // Sort so that all keys appear together, and names within keys.
      constraints.sort(
        (a, b) => a.key.localeCompare(b.key) || a.name.localeCompare(b.name));

      for (const keyGroup of groupSortedBy(constraints, c => c.key)) {
        const key = keyGroup[0].key;
        const items = [];

        for (const nameGroup of groupSortedBy(keyGroup, c => c.name)) {
          let first = true;
          for (const part of nameGroup) {
            if (first) {
              items.push('_' + this.encodeName(part.name));
              first = false;
            } else {
              items.push('');
            }
            items.push(...part.cells);
          }
        }

        parts.push(this._argsToString(key, ...items));
      }

      return parts.join('');
    }

    static *makeFromArgs(...args) {
      const [key, ...items] = args;

      let currentName = '';
      let currentCells = [];
      for (const item of items) {
        if (item.length && 'R' === item[0].toUpperCase()) {
          // This is a cell.
          currentCells.push(item);
          continue;
        }
        // Otherwise we are starting a new group. Yield the current one.
        if (currentCells.length) {
          yield new this(key, currentName, ...currentCells);
        }

        // Update the name if it has been replaced.
        if (item.length) {
          currentName = this.decodeName(item.substring(1));
        }

        currentCells = [];
      }

      if (currentCells.length) {
        yield new this(key, currentName, ...currentCells);
      }
    }

    static fnToKey(fn, numValues) {
      const array = this._fnTo6BitArray(fn, numValues);
      return Base64Codec.encode6BitArray(array);
    }

    static _fnTo6BitArray(fn, numValues) {
      const NUM_BITS = 6;
      const array = [];

      let v = 0;
      let vIndex = 0;
      for (let i = 1; i <= numValues; i++) {
        for (let j = 1; j <= numValues; j++) {
          v |= (!!fn(i, j)) << vIndex;
          if (++vIndex == NUM_BITS) {
            array.push(v);
            vIndex = 0;
            v = 0;
          }
        }
      }
      array.push(v);

      // Trim trailing zeros.
      while (array.length && !array[array.length - 1]) array.pop();

      return array;
    }

    static encodeName(displayName) {
      const name = encodeURIComponent(displayName);
      return name.replace(/\./g, '%2E').replace(/~/g, '%7E');
    }

    static decodeName(name) {
      let displayName = name;
      try {
        displayName = decodeURIComponent(name);
      } catch (e) { }
      return displayName;
    }
  }

  static BinaryX = class BinaryX extends SudokuConstraint.Binary {
    static CATEGORY = 'CustomBinary';
    static DISPLAY_CONFIG = {
      displayClass: 'CustomBinary',
      startMarker: LineOptions.SMALL_FULL_CIRCLE_MARKER,
    };

    static fnToKey(fn, numValues) {
      // Make the function symmetric.
      return super.fnToKey(
        (a, b) => fn(a, b) && fn(b, a),
        numValues);
    }
  }

  static Indexing = class Indexing extends SudokuConstraintBase {
    static DESCRIPTION = (`
      Column indexing: For a cell in column C, the value (V) of the cell
      tells where the value C is placed in that row. Specifically, if the
      cell has coordinates (R, C) and value V, then cell (R, V) has the
      value C.Row indexing is the same, but for rows.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'Indexing',
    };
    static VALIDATE_CELLS_FN = (cells, shape) => cells.length > 0;

    static ROW_INDEXING = 'R';
    static COL_INDEXING = 'C';
    static ARGUMENT_CONFIG = {
      options: [
        { value: this.COL_INDEXING, text: 'Column' },
        { value: this.ROW_INDEXING, text: 'Row' },
      ],
    }

    constructor(indexType, ...cells) {
      super(arguments);
      this.indexType = indexType;
      this.cells = cells;
    }

    chipLabel() {
      return `${this.indexTypeStr()} Indexing`;
    }

    indexTypeStr() {
      return SudokuConstraint.Indexing.ROW_INDEXING
        ? 'Row' : 'Column';
    }
  }

  static CountingCircles = class CountingCircles extends SudokuConstraintBase {
    static DESCRIPTION = (`
      The value in a circles counts the number of circles with the same
      value. Each set of circles is independent.`);
    static CATEGORY = 'LinesAndSets';
    static DISPLAY_CONFIG = {
      displayClass: 'CountingCircles',
    };

    constructor(...cells) {
      super(arguments);
      this.cells = cells;
    }

    chipLabel() {
      return `Counting Circles (${this.cells.length})`;
    }
  }

  static Given = class Given extends SudokuConstraintBase {
    static CATEGORY = 'GivenCandidates';
    static DISPLAY_CONFIG = { displayClass: 'Givens' };
    static UNIQUENESS_KEY_FIELD = 'cell';

    constructor(cell, ...values) {
      super(arguments);
      this.cell = cell;
      this.values = values;
    }

    static *makeFromArgs(...args) {
      const shape = SHAPE_MAX;
      for (const valueId of args) {
        const { cellId, values } = shape.parseValueId(valueId);
        yield new this(cellId, ...values);
      }
    }

    static serialize(constraints) {
      const args = constraints.map(
        c => `${c.cell}_${c.values.join('_')}`);
      return this._argsToString(...args);
    }

    chipLabel() {
      let valueStr = this.values.join(',');
      if (this.values.length !== 1) valueStr = `[${valueStr}]`;
      return `${this.cell}: ${valueStr}`;
    }

    getCells(shape) {
      return [this.cell];
    }
  }

  static Priority = class Priority extends SudokuConstraintBase {
    constructor(priority, ...cells) {
      super(arguments);
      this.cells = cells;
      this.priority = priority;
    }
  }
}

class SudokuBuilder {
  static build(constraint, debugOptions) {
    const shape = constraint.getShape();

    return new SudokuSolver(
      this._handlers(constraint, shape),
      shape,
      debugOptions);
  }

  // Ask for a state update every 2**13 iterations.
  // NOTE: Using a non-power of 10 makes the display look faster :)
  static LOG_UPDATE_FREQUENCY = 13;

  static _unusedWorkers = [];

  static resolveConstraint(constraint) {
    const args = constraint.args;
    const cls = SudokuConstraint[constraint.type];

    if (cls.IS_COMPOSITE) {
      args[0] = constraint.args[0].map(a => this.resolveConstraint(a));
    }
    return new cls(...args);
  }

  static async buildInWorker(constraints, stateHandler, statusHandler, debugHandler) {
    // Ensure any pending terminations are enacted.
    await new Promise(r => setTimeout(r, 0));

    if (!this._unusedWorkers.length) {
      this._unusedWorkers.push(new Worker('js/worker.js' + VERSION_PARAM));
    }
    const worker = this._unusedWorkers.pop();
    worker.release = () => this._unusedWorkers.push(worker);

    const solverProxy = new SolverProxy(
      worker, stateHandler, statusHandler,
      debugHandler?.getCallback());
    await solverProxy.init(
      constraints, this.LOG_UPDATE_FREQUENCY,
      debugHandler?.getOptions());
    return solverProxy;
  }

  static *_handlers(constraint, shape) {
    const constraintMap = constraint.toMap();

    yield* this._rowColHandlers(shape);
    if (constraintMap.has('NoBoxes')) {
      yield new SudokuConstraintHandler.NoBoxes();
    } else {
      yield* this._boxHandlers(shape);
    }
    yield* this._constraintHandlers(constraintMap, shape);
  }

  static *_rowColHandlers(shape) {
    for (const cells of SudokuConstraintBase.rowRegions(shape)) {
      yield new SudokuConstraintHandler.AllDifferent(cells);
    }
    for (const cells of SudokuConstraintBase.colRegions(shape)) {
      yield new SudokuConstraintHandler.AllDifferent(cells);
    }
  }

  static *_boxHandlers(shape) {
    for (const cells of SudokuConstraintBase.boxRegions(shape)) {
      yield new SudokuConstraintHandler.AllDifferent(cells);
    }
  }

  static *_strictAdjHandlers(constraints, shape, fnKey) {
    const numCells = shape.numCells;
    const intCmp = (a, b) => a - b;
    const pairId = p => p[0] + p[1] * numCells;

    // Find all the cell pairs that have constraints.
    const cellPairs = constraints
      .map(x => x.cells.map(c => shape.parseCellId(c).cell));
    cellPairs.forEach(p => p.sort(intCmp));
    const pairIds = new Set(cellPairs.map(pairId));

    // Add negative constraints for all other cell pairs.
    for (const p of this._adjacentCellPairs(shape)) {
      p.sort(intCmp);
      if (pairIds.has(pairId(p))) continue;
      yield new SudokuConstraintHandler.BinaryConstraint(
        p[0], p[1], fnKey);
    }
  }

  // Helper to create a given handler for a single cell/value pair.
  static _givenHandler(cell, value) {
    const givensMap = new Map();
    givensMap.set(cell, [value]);
    return new SudokuConstraintHandler.GivenCandidates(givensMap);
  }

  static * _regionSumLineHandlers(cells, regions, numValues) {
    // Map cells to regions.
    const cellToRegion = new Map();
    for (const region of regions) {
      for (const cell of region) cellToRegion.set(cell, region);
    }

    // Split cells into sections of equal sum.
    const cellSets = [];
    let curSet = null;
    let curRegion = null;
    for (const cell of cells) {
      const newRegion = cellToRegion.get(cell);
      if (newRegion !== curRegion) {
        curRegion = newRegion;
        curSet = [];
        cellSets.push(curSet);
      }
      curSet.push(cell);
    }

    const singles = cellSets.filter(s => s.length == 1).map(s => s[0]);
    const multis = cellSets.filter(s => s.length > 1);

    if (singles.length > 1) {
      const key = SudokuConstraint.SameValues.fnKey(numValues);
      yield new SudokuConstraintHandler.BinaryPairwise(
        key, ...singles);
    }

    if (singles.length > 0) {
      // If there are any singles, then use it to constrain every
      // multi. The viable sums can propagate through any of the
      // singles.
      const singleCell = singles[0];
      for (let i = 0; i < multis.length; i++) {
        yield SudokuConstraintHandler.Sum.makeEqual([singleCell], multis[i]);
      }
    } else {
      // Otherwise set up an equal sum constraint between every
      // pair of multis.
      for (let i = 1; i < multis.length; i++) {
        for (let j = 0; j < i; j++) {
          yield SudokuConstraintHandler.Sum.makeEqual(multis[i], multis[j]);
        }
      }
    }
  }

  static * _constraintHandlers(constraintMap, shape) {
    const gridSize = shape.gridSize;

    const constraints = [].concat(...constraintMap.values());

    for (const constraint of constraints) {
      let cells;
      switch (constraint.type) {
        case 'AntiKnight':
          yield* this._antiHandlers(shape,
            (r, c) => [[r + 1, c + 2], [r + 2, c + 1], [r + 1, c - 2], [r + 2, c - 1]]);
          break;

        case 'AntiKing':
          yield* this._antiHandlers(shape, (r, c) => [[r + 1, c + 1], [r + 1, c - 1]]);
          break;

        case 'AntiConsecutive':
          yield* this._antiConsecutiveHandlers(shape);
          break;

        case 'AntiTaxicab':
          {
            for (let i = 0; i < shape.numCells; i++) {
              const valueMap = [];
              for (let d = 1; d <= shape.numValues; d++) {
                const [r, c] = shape.splitCellIndex(i);
                valueMap.push(
                  SudokuConstraint.AntiTaxicab.taxicabCells(r, c, d, shape));
              }
              yield new SudokuConstraintHandler.ValueDependentUniqueValueExclusion(
                i, valueMap);
            }
          }
          break;

        case 'Jigsaw':
          {
            cells = constraint.cells.map(c => shape.parseCellId(c).cell);
            yield new SudokuConstraintHandler.AllDifferent(cells);
            // Just to let the solver know that this is a jigsaw puzzle.
            yield new SudokuConstraintHandler.JigsawPiece(cells);
          }
          break;

        case 'Diagonal':
          cells = [];
          for (let r = 0; r < gridSize; r++) {
            let c = constraint.direction > 0 ? gridSize - r - 1 : r;
            cells.push(shape.cellIndex(r, c));
          }
          yield new SudokuConstraintHandler.AllDifferent(cells);
          break;

        case 'Arrow':
          {
            const cells = (
              constraint.cells.map(c => shape.parseCellId(c).cell));
            yield SudokuConstraintHandler.Sum.makeEqual(
              [cells[0]], cells.slice(1));
          }
          break;

        case 'DoubleArrow':
          {
            const cells = (
              constraint.cells.map(c => shape.parseCellId(c).cell));

            const center = cells.splice(1, cells.length - 2);
            yield SudokuConstraintHandler.Sum.makeEqual(cells, center);
          }
          break;

        case 'PillArrow':
          {
            const pillSize = constraint.pillSize;
            if (pillSize != 2 && pillSize != 3) {
              throw ('Pill size must be 2 or 3');
            }
            const cells = (
              constraint.cells.map(c => shape.parseCellId(c).cell));

            const pillCells = cells.slice(0, pillSize);
            pillCells.sort((a, b) => a - b);

            cells.splice(0, pillSize, ...pillCells);
            const coeffs = cells.map(_ => 1);
            for (let i = 0; i < pillSize; i++) {
              cells[i] = pillCells[i];
              coeffs[i] = -Math.pow(10, pillSize - i - 1);
            }

            yield new SudokuConstraintHandler.Sum(cells, 0, coeffs);

            if (shape.numValues > 9) {
              // Limit pill values to 1-9, other than the first cell.
              const values = [...Array(9).keys()].map(i => i + 1);
              for (let i = 1; i < pillSize; i++) {
                yield this._givenHandler(pillCells[i], values);
              }
            }
          }
          break;

        case 'Cage':
          cells = constraint.cells.map(c => shape.parseCellId(c).cell);
          // A sum of 0 means any sum is ok - i.e. the same as AllDifferent.
          if (constraint.sum != 0) {
            yield new SudokuConstraintHandler.Sum(cells, constraint.sum);
          }
          yield new SudokuConstraintHandler.AllDifferent(cells);
          break;

        case 'Sum':
          cells = constraint.cells.map(c => shape.parseCellId(c).cell);
          yield new SudokuConstraintHandler.Sum(cells, constraint.sum);
          break;

        case 'LittleKiller':
          cells = constraint.getCells(shape).map(
            c => shape.parseCellId(c).cell);
          yield new SudokuConstraintHandler.Sum(
            cells, constraint.value);
          break;

        case 'XSum':
          {
            const cells = constraint.getCells(shape).map(
              c => shape.parseCellId(c).cell);
            const sum = constraint.value;

            const controlCell = cells[0];

            if (sum === 1) {
              yield this._givenHandler(controlCell, 1);
              break;
            }

            const handlers = [];
            for (let i = 2; i <= cells.length; i++) {
              const sumRem = sum - i;
              if (sumRem <= 0) break;
              handlers.push(new SudokuConstraintHandler.And(
                this._givenHandler(controlCell, i),
                new SudokuConstraintHandler.Sum(cells.slice(1, i), sumRem)));
            }
            yield new SudokuConstraintHandler.Or(...handlers);
          }
          break;

        case 'Sandwich':
          cells = constraint.getCells(shape).map(
            c => shape.parseCellId(c).cell);
          yield new SudokuConstraintHandler.Lunchbox(cells, constraint.value);
          break;

        case 'Lunchbox':
          cells = constraint.cells.map(c => shape.parseCellId(c).cell);
          yield new SudokuConstraintHandler.Lunchbox(cells, constraint.sum);
          break;

        case 'Skyscraper':
          cells = constraint.getCells(shape).map(
            c => shape.parseCellId(c).cell);
          yield new SudokuConstraintHandler.Skyscraper(
            cells, constraint.value);
          break;

        case 'HiddenSkyscraper':
          cells = constraint.getCells(shape).map(
            c => shape.parseCellId(c).cell);
          yield new SudokuConstraintHandler.HiddenSkyscraper(
            cells, constraint.value);
          break;

        case 'NumberedRoom':
          cells = constraint.getCells(shape).map(
            c => shape.parseCellId(c).cell);
          yield new SudokuConstraintHandler.NumberedRoom(
            cells, constraint.value);
          break;

        case 'AllDifferent':
          cells = constraint.cells.map(c => shape.parseCellId(c).cell);
          yield new SudokuConstraintHandler.AllDifferent(cells);
          break;

        case 'Given':
          {
            const cell = shape.parseCellId(constraint.cell).cell;
            const valueMap = new Map();
            valueMap.set(cell, constraint.values);
            yield new SudokuConstraintHandler.GivenCandidates(valueMap);
          }
          break;

        case 'Thermo':
          cells = constraint.cells.map(c => shape.parseCellId(c).cell);
          for (let i = 1; i < cells.length; i++) {
            yield new SudokuConstraintHandler.BinaryConstraint(
              cells[i - 1], cells[i],
              SudokuConstraint.Thermo.fnKey(shape.numValues));
          }
          break;

        case 'Whisper':
          let difference = constraint.difference;
          cells = constraint.cells.map(c => shape.parseCellId(c).cell);
          for (let i = 1; i < cells.length; i++) {
            yield new SudokuConstraintHandler.BinaryConstraint(
              cells[i - 1], cells[i],
              SudokuConstraint.Whisper.fnKey(difference, shape.numValues));
          }
          break;

        case 'Renban':
          cells = constraint.cells.map(c => shape.parseCellId(c).cell);
          {
            const handler = new SudokuConstraintHandler.BinaryPairwise(
              SudokuConstraint.Renban.fnKey(cells.length, shape.numValues),
              ...cells);
            handler.enableHiddenSingles();
            yield handler;
          }
          break;

        case 'Modular':
          cells = constraint.cells.map(c => shape.parseCellId(c).cell);
          if (cells.length < constraint.mod) {
            const handler = new SudokuConstraintHandler.BinaryPairwise(
              SudokuConstraint.Modular.fnKey(constraint.mod, shape.numValues),
              ...cells);
            yield handler;
          } else {
            for (let i = constraint.mod; i <= cells.length; i++) {
              const handler = new SudokuConstraintHandler.BinaryPairwise(
                SudokuConstraint.Modular.fnKey(constraint.mod, shape.numValues),
                ...cells.slice(i - constraint.mod, i));
              yield handler;
            }
          }
          break;

        case 'Entropic':
          cells = constraint.cells.map(c => shape.parseCellId(c).cell);
          if (cells.length < 3) {
            const handler = new SudokuConstraintHandler.BinaryPairwise(
              SudokuConstraint.Entropic.fnKey(shape.numValues),
              ...cells);
            yield handler;
          } else {
            for (let i = 3; i <= cells.length; i++) {
              const handler = new SudokuConstraintHandler.BinaryPairwise(
                SudokuConstraint.Entropic.fnKey(shape.numValues),
                ...cells.slice(i - 3, i));
              yield handler;
            }
          }
          break;


        case 'RegionSumLine':
          {
            cells = constraint.cells.map(c => shape.parseCellId(c).cell);
            if (!constraintMap.has('NoBoxes') && !shape.noDefaultBoxes) {
              // Default boxes.
              const regions = SudokuConstraintBase.boxRegions(shape);
              yield* this._regionSumLineHandlers(cells, regions, shape.numValues);
            } else if (constraintMap.has('Jigsaw')) {
              // If no boxes is set, try to use the jigsaw regions.
              const jigsawConstraints = constraintMap.get('Jigsaw');
              const regions = jigsawConstraints.map(
                c => c.cells.map(c => shape.parseCellId(c).cell));
              yield* this._regionSumLineHandlers(cells, regions, shape.numValues);
            } else {
              // There are no regions, so the constraint is trivially satisfied.
            }
          }
          break;

        case 'Between':
          cells = constraint.cells.map(c => shape.parseCellId(c).cell);
          yield new SudokuConstraintHandler.Between(cells);
          break;

        case 'Lockout':
          cells = constraint.cells.map(c => shape.parseCellId(c).cell);
          yield new SudokuConstraintHandler.Lockout(constraint.minDiff, cells);
          break;

        case 'Palindrome':
          cells = constraint.cells.map(c => shape.parseCellId(c).cell);
          const numCells = cells.length;
          for (let i = 0; i < numCells / 2; i++) {
            yield new SudokuConstraintHandler.BinaryConstraint(
              cells[i], cells[numCells - 1 - i],
              SudokuConstraint.Palindrome.fnKey(shape.numValues));
          }
          break;
        case 'Zipper':
          cells = constraint.cells.map(c => shape.parseCellId(c).cell);
          {
            const pairs = [];
            const numCells = cells.length;
            for (let i = 0; i < ((numCells / 2) | 0); i++) {
              pairs.push([cells[i], cells[numCells - 1 - i]]);
            }
            if (numCells % 2 == 1) {
              // If there are an odd numbers of cells, then treat this as a
              // set of arrows from the center cell to each pair.
              // We don't bother to also add constraints between each pair, as
              // the constraint on the total sum should propagate through the
              // center cell.
              const centerCell = [cells[(numCells / 2) | 0]];
              for (const pair of pairs) {
                yield SudokuConstraintHandler.Sum.makeEqual(centerCell, pair);
              }
            } else {
              // Otherwise create an equal sum constraint between each pair.
              const numPairs = pairs.length;
              for (let i = 1; i < numPairs; i++) {
                for (let j = 0; j < i; j++) {
                  yield SudokuConstraintHandler.Sum.makeEqual(pairs[i], pairs[j]);
                }
              }
            }
          }
          break;

        case 'SumLine':
          cells = new CellArgs(constraint.cells, constraint.type);
          yield new SudokuConstraintHandler.SumLine(
            cells.cellIds(shape), cells.isLoop(), constraint.sum);
          break;

        case 'WhiteDot':
          cells = constraint.cells.map(c => shape.parseCellId(c).cell);
          yield new SudokuConstraintHandler.BinaryConstraint(
            cells[0], cells[1],
            SudokuConstraint.WhiteDot.fnKey(shape.numValues));
          break;

        case 'BlackDot':
          cells = constraint.cells.map(c => shape.parseCellId(c).cell);
          yield new SudokuConstraintHandler.BinaryConstraint(
            cells[0], cells[1],
            SudokuConstraint.BlackDot.fnKey(shape.numValues));
          break;

        case 'X':
          cells = constraint.cells.map(c => shape.parseCellId(c).cell);
          yield new SudokuConstraintHandler.Sum(cells, 10);
          break;

        case 'V':
          cells = constraint.cells.map(c => shape.parseCellId(c).cell);
          yield new SudokuConstraintHandler.Sum(cells, 5);
          break;

        case 'Comparison': {
          let mode = constraint.mode;
          let primaryCell = shape.parseCellId(constraint.primaryCell).cell;
          let fn = SudokuConstraint.Comparison.fnKey(mode, shape.numValues);
          for (let secondary of constraint.secondaryCells) {
            let secondaryCell = shape.parseCellId(secondary).cell;
            yield new SudokuConstraintHandler.BinaryConstraint(primaryCell, secondaryCell, fn);
          }
          break;
        }

        case 'ValueIndexing':
          {
            const cells = constraint.cells.map(
              c => shape.parseCellId(c).cell);
            yield new SudokuConstraintHandler.ValueIndexing(...cells);
          }
          break;
        case 'Windoku':
          for (const cells of SudokuConstraint.Windoku.regions(shape)) {
            yield new SudokuConstraintHandler.AllDifferent(cells);
          }
          break;

        case 'DisjointSets':
          for (const cells of SudokuConstraintBase.disjointSetRegions(shape)) {
            yield new SudokuConstraintHandler.AllDifferent(cells);
          }
          break;

        case 'GlobalEntropy':
          for (const cells of SudokuConstraintBase.square2x2Regions(shape)) {
            yield new SudokuConstraintHandler.LocalEntropy(cells);
          }
          break;

        case 'GlobalMod':
          for (const cells of SudokuConstraintBase.square2x2Regions(shape)) {
            yield new SudokuConstraintHandler.LocalMod3(cells);
          }
          break;

        case 'ContainAtLeast':
          yield new SudokuConstraintHandler.RequiredValues(
            constraint.cells.map(c => shape.parseCellId(c).cell),
            constraint.values.split('_').map(v => +v),
            /* strict = */ false);
          break;

        case 'ContainExact':
          yield new SudokuConstraintHandler.RequiredValues(
            constraint.cells.map(c => shape.parseCellId(c).cell),
            constraint.values.split('_').map(v => +v),
            /* strict = */ true);
          break;

        case 'SameValues':
          {
            if (constraint.numSets < constraint.cells.length) {
              let sets = constraint.splitCells();
              sets = sets.map(cells => cells.map(c => shape.parseCellId(c).cell));
              yield new SudokuConstraintHandler.SameValues(...sets);
            } else {
              // All cells must have the same value, use binary constraints.
              const cells = constraint.cells.map(c => shape.parseCellId(c).cell);
              const key = SudokuConstraint.SameValues.fnKey(shape.numValues);
              yield new SudokuConstraintHandler.BinaryPairwise(
                key, ...cells);
            }
          }
          break;

        case 'Quad':
          yield new SudokuConstraintHandler.RequiredValues(
            SudokuConstraint.Quad.cells(
              constraint.topLeftCell).map(c => shape.parseCellId(c).cell),
            constraint.values.map(v => +v),
            /* strict = */ false);
          break;

        case 'Binary':
          {
            cells = constraint.cells.map(c => c && shape.parseCellId(c).cell);
            for (let i = 1; i < cells.length; i++) {
              yield new SudokuConstraintHandler.BinaryConstraint(
                cells[i - 1], cells[i],
                constraint.key);
            }
          }
          break;

        case 'BinaryX':
          {
            cells = constraint.cells.map(c => c && shape.parseCellId(c).cell);
            yield new SudokuConstraintHandler.BinaryPairwise(
              constraint.key, ...cells);
          }
          break;

        case 'Indexing':
          for (let i = 0; i < constraint.cells.length; i++) {
            const controlCell = shape.parseCellId(constraint.cells[i]);
            const value =
              constraint.indexType == SudokuConstraint.Indexing.ROW_INDEXING
                ? controlCell.row + 1 : controlCell.col + 1;

            const cells = [];
            for (let i = 0; i < shape.gridSize; i++) {
              if (constraint.indexType == SudokuConstraint.Indexing.ROW_INDEXING) {
                cells.push(shape.cellIndex(i, controlCell.col));
              } else {
                cells.push(shape.cellIndex(controlCell.row, i));
              }
            }

            yield new SudokuConstraintHandler.Indexing(
              controlCell.cell, cells, value);
          }
          break;

        case 'FullRank':
          {
            const line = constraint.getCells(shape).map(
              c => shape.parseCellId(c).cell);
            yield new SudokuConstraintHandler.FullRank(
              shape.numCells, [{ rank: constraint.value, line }]);
          }
          break;

        case 'CountingCircles':
          cells = new CellArgs(constraint.cells, constraint.type);
          yield new SudokuConstraintHandler.CountingCircles(
            cells.cellIds(shape));
          break;

        case 'StrictKropki':
          {
            const types = ['BlackDot', 'WhiteDot'];
            yield* SudokuBuilder._strictAdjHandlers(
              types.flatMap(t => constraintMap.get(t) || []),
              shape,
              SudokuConstraint.StrictKropki.fnKey(shape.numValues));
          }
          break;

        case 'StrictXV':
          {
            const types = ['X', 'V'];
            yield* SudokuBuilder._strictAdjHandlers(
              types.flatMap(t => constraintMap.get(t) || []),
              shape,
              SudokuConstraint.StrictXV.fnKey(shape.numValues));
          }
          break;

        case 'Priority':
          cells = constraint.cells.map(c => shape.parseCellId(c).cell);
          yield new SudokuConstraintHandler.Priority(cells, constraint.priority);
          break;

        case 'Or':
          {
            const handlers = [];
            for (const c of constraint.constraints) {
              const cHandlers = [...this._constraintHandlers(c.toMap(), shape)];
              handlers.push(new SudokuConstraintHandler.And(...cHandlers));
            }
            yield new SudokuConstraintHandler.Or(...handlers);
          }
          break;

        case 'And':
          for (const c of constraint.constraints) {
            yield* this._constraintHandlers(c.toMap(), shape);
          }

        case 'NoBoxes':
        case 'Shape':
          // Nothing to do here.
          break;

        default:
          throw ('Unknown constraint type: ' + constraint.type);
      }
    }
  }

  static * _antiHandlers(shape, exclusionFn) {
    const gridSize = shape.gridSize;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = shape.cellIndex(r, c);
        // We only need half the constraints, as the other half will be
        // added by the corresponding exclusion cell.
        for (const [rr, cc] of exclusionFn(r, c)) {
          if (rr < 0 || rr >= gridSize || cc < 0 || cc >= gridSize) continue;
          const exclusionCell = shape.cellIndex(rr, cc);
          yield new SudokuConstraintHandler.AllDifferent([cell, exclusionCell]);
        }
      }
    }
  }

  static _adjacentCellPairs(shape) {
    const pairs = [];

    const gridSize = shape.gridSize;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        let cell = shape.cellIndex(r, c);
        // Only look at adjacent cells with larger indexes.
        for (const [rr, cc] of [[r + 1, c], [r, c + 1]]) {
          if (rr < 0 || rr >= gridSize || cc < 0 || cc >= gridSize) continue;
          pairs.push([cell, shape.cellIndex(rr, cc)]);
        }
      }
    }

    return pairs;
  }

  static * _antiConsecutiveHandlers(shape) {
    for (const [cell, exclusionCell] of this._adjacentCellPairs(shape)) {
      yield new SudokuConstraintHandler.BinaryConstraint(
        cell, exclusionCell,
        SudokuConstraint.AntiConsecutive.fnKey(shape.numValues));
    }
  }
}

class SolverProxy {
  constructor(worker, stateHandler, statusHandler, debugHandler) {
    if (!worker) {
      throw ('Must provide worker');
    }

    this._worker = worker;
    this._messageHandler = (msg) => this._handleMessage(msg);
    this._worker.addEventListener('message', this._messageHandler);
    this._waiting = null;

    this._initialized = false;
    this._stateHandler = stateHandler || (() => null);
    this._debugHandler = debugHandler || (() => null);
    this._statusHandler = statusHandler || (() => null);
  }

  async solveAllPossibilities() {
    return this._callWorker('solveAllPossibilities');
  }

  async validateLayout() {
    return this._callWorker('validateLayout');
  }

  async nthSolution(n) {
    return this._callWorker('nthSolution', n);
  }

  async nthStep(n, stepGuides) {
    return this._callWorker('nthStep', [n, stepGuides]);
  }

  async countSolutions() {
    return this._callWorker('countSolutions');
  }

  _handleMessage(response) {
    // Solver has been terminated.
    if (!this._worker) return;

    let data = response.data;

    switch (data.type) {
      case 'result':
        this._waiting.resolve(data.result);
        this._statusHandler(false, this._waiting.method);
        this._waiting = null;
        break;
      case 'exception':
        this._waiting.reject(data.error);
        this._statusHandler(false, this._waiting.method);
        this._waiting = null;
        break;
      case 'state':
        this._stateHandler(data.state);
        break;
      case 'debug':
        this._debugHandler(data.data, data.counters);
        break;
    }
  }

  _callWorker(method, payload) {
    if (!this._initialized) {
      throw (`SolverProxy not initialized.`);
    }
    if (!this._worker) {
      throw (`SolverProxy has been terminated.`);
    }
    if (this._waiting) {
      throw (`Can't call worker while a method is in progress. (${this._waiting.method})`);
    }

    this._statusHandler(true, method);

    let promise = new Promise((resolve, reject) => {
      this._waiting = {
        method: method,
        payload: payload,
        resolve: resolve,
        reject: reject,
      }
    });

    this._worker.postMessage({
      method: method,
      payload: payload,
    });

    return promise;
  }

  async init(constraint, logUpdateFrequency, debugOptions) {
    this._initialized = true;
    await this._callWorker(
      'init',
      { constraint, logUpdateFrequency, debugOptions });
  }

  terminate() {
    if (!this._worker) return;
    const worker = this._worker;
    this._worker = null;

    worker.removeEventListener('message', this._messageHandler);
    // If we are waiting, we have to kill it because we don't know how long
    // we'll be waiting. Otherwise we can just release it to be reused.
    if (this._waiting) {
      worker.terminate();
      this._waiting.reject('Aborted worker running: ' + this._waiting.method);
      this._statusHandler(false, 'terminate');
    } else {
      worker.release();
    }
  }

  isTerminated() {
    return this._worker === null;
  }
};

const toShortSolution = (solution, shape) => {
  const baseCharCode = SudokuParser.shapeToBaseCharCode(shape);
  const DEFAULT_VALUE = '.';

  const result = new Array(solution.length).fill(DEFAULT_VALUE);

  for (let i = 0; i < solution.length; i++) {
    result[i] = String.fromCharCode(baseCharCode + solution[i] - 1);
  }
  return result.join('');
}