class CalcFunc
{
  constructor()
  {
    this.func_name = "";
    this.n_params = 0;
    this.curr_param = 0;
    this.params = [];
    this.default_params = [];
  }

  reset()
  {
    this.curr_param = 0;
    this.params = this.default_params;
  }

  get_func_statement()
  {
    return this.func_name + "(" + this.params.join(", ") + ")"
  }

  enter_param(val)
  {
    if (this.curr_param < this.n_params) {
      this.params[this.curr_param] = val;
      this.curr_param++;
    }
  }

  remove_last_param()
  {
    if (this.curr_param > 0) {
      this.curr_param--;
      this.params[this.curr_param] = this.default_params[this.param];
    }
  }

  get_result()
  {
    return 0;
  }
}

class Calc
{
  constructor()
  {
    this.statement = "";
    this.notes = "";
    this.entry = 0;
    this.entry_text = "";
    this.last_value = 0;
    this.parentheses_level = 0;
    this.solved = false;
    // states for complex function
    this.complex_func = false;
    this.n_params = 0;
    this.curr_params = 0;
    this.func = function() { return; };
    this.params = [];
  }

  get_statement()
  {
    return this.statement
  }

  get_notes()
  {
    return this.notes;
  }

  get_entry()
  {
    return this.entry_text;
  }

  get_last_value()
  {
    return this.last_value;
  }

  clear()
  {
    this.solved = false;
    this.complex_func = false;
    this.n_params = 0;
    this.curr_params = 0;
    this.func = function() { return; };
    this.params = [];
    this.statement = "";
    this.notes = "";
    this.clear_entry()
  }

  clear_entry()
  {
    this.entry = 0;
    this.entry_text = "";
  }

  entry_number(val)
  {
    if (this.solved) {
      this.clear();
    }
    this.solved = false;
    this.entry_text = this.entry_text + val;
    this.entry = eval(this.entry_text);
  }

  entry_negative()
  {
    this.entry = -1 * this.entry;
    this.entry_text = this.entry.toString();
    this.solved = false;
  }

  add_op(op)
  {
    if (this.solved) {
      this.solved = false;
      this.statement = "";
      console.log(this.entry);
      this.add_op(op);
      return;
    }
    this.statement += this.entry_text + op;
    this.clear_entry();
    console.log(this.statement)
  }

  add_parentheses(val)
  {
    this.solved = false;
    if (this.entry_text.length == 0) {
      if (val == "(") {
        this.statement += val;
        this.parentheses_level++;
      }
    }
    else {
      if (val == ")") {
        this.add_op(val);
        this.parentheses_level--;
      }
    }
    console.log(this.statement)
  }

  solve()
  {
    console.log(this.solved);
    if (!this.solved) {
      if (this.complex_func) {
        return;
      }
      else {
        this.solved = true;
        this.statement += this.entry_text + "=";
        this.entry = eval(this.statement.substring(0, this.statement.length - 1));
        this.entry_text = this.entry.toString();
        this.last_value = this.entry;
      }
    }
  }

  f_percent()
  {
    this.entry /= 100.0;
    this.entry_text = this.entry.toString();
  }

  f_sqr()
  {
    this.entry *= this.entry;
    this.entry_text = this.entry.toString();
  }

  f_sqrt()
  {
    this.entry = Math.sqrt(this.entry);
    this.entry_text = this.entry.toString();
  }

  f_cagr()
  {
    if (this.complex_func) {
      if (this.curr_params < this.n_params) {
        this.params[this.curr_params] = this.entry;
        this.notes = this.params.join(", ") + ")";
        console.log(this.params);
        console.log(this.notes);
        this.curr_params += 1;
        this.clear_entry();
      }
      if (this.curr_params == this.n_params) {
        this.entry = Math.pow((this.params[1] / this.params[0]), 1 / this.params[2]) - 1;
        this.entry_text = this.entry.toString();
        this.last_value = this.entry;
        this.solved = true;
      }
    }
    else {
      this.complex_func = true;
      this.func = this.f_cagr;
      this.n_params = 3;
      this.curr_params = 0;
      this.statement = "CAGR("
      this.params = ["begin", "end", "periods"];
      this.notes = this.params.join(", ") + ")";
    }
  }
}

class CalcDisplay
{
  constructor(calc)
  {
    this.statement = "";
    this.notes = "";
    this.entry = "";
    this.calc = calc;
  }

  show()
  {
    document.getElementById("CalcStatement").innerText =
      this.calc.get_statement() + this.calc.get_notes();
    document.getElementById("CalcEntry").innerText = this.calc.get_entry();
  }
}

var calc = new Calc();
var display = new CalcDisplay(calc);

function on_button(val)
{
  switch (val) {
    case "C":
      calc.clear();
      break;
    case "CE":
      calc.clear_entry();
      break;
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case ".":
      calc.entry_number(val);
      break;
    case "neg":
      calc.entry_negative();
      break;
    case "+":
    case "-":
    case "*":
    case "/":
      calc.add_op(val)
      break;
    case "(":
    case ")":
      calc.add_parentheses(val)
      break;
    case "=":
      calc.solve()
      break;
    case "f_PERCENT":
      calc.f_percent();
      break;
    case "f_SQR":
      calc.f_sqr();
      break;
    case "f_SQRT":
      calc.f_sqrt();
      break;
    case "f_CAGR":
      calc.f_cagr();
      break;
    default:
      return;
  }
  display.show();
}

Mousetrap.bind("0", function() {on_button("0")});
Mousetrap.bind("1", function() {on_button("1")});
Mousetrap.bind("2", function() {on_button("2")});
Mousetrap.bind("3", function() {on_button("3")});
Mousetrap.bind("4", function() {on_button("4")});
Mousetrap.bind("5", function() {on_button("5")});
Mousetrap.bind("6", function() {on_button("6")});
Mousetrap.bind("7", function() {on_button("7")});
Mousetrap.bind("8", function() {on_button("8")});
Mousetrap.bind("9", function() {on_button("9")});
Mousetrap.bind("+", function() {on_button("+")});
Mousetrap.bind("-", function() {on_button("-")});
Mousetrap.bind("*", function() {on_button("*")});
Mousetrap.bind("/", function() {on_button("/")});
Mousetrap.bind("(", function() {on_button("(")});
Mousetrap.bind(")", function() {on_button(")")});
Mousetrap.bind(".", function() {on_button(".")});
Mousetrap.bind("enter", function() {on_button("=")});
Mousetrap.bind("esc", function() {on_button("C")});
Mousetrap.bind("backspace", function() {on_button("CE")});
