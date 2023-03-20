const canvas_width = 1200;
const canvas_height = 2000;

let c_a = [-200, 0];
let c_b = [200, 0];

// Vector accessors
const x = 0;
const y = 1;

const baseline = c_b[x] - c_a[x];

// x-y cartesian to canvas
function x_trans(x) {
    return x + canvas_width / 2;
}
function y_trans(y) {
    return canvas_height - baseline/2 - y;
}

const r_a = 60;
const r_b = 80;

let omega_a = 8;
let omega_b = 17;

let link_0_length = 600;
let link_1_length = 600;
let link_2_length = 600;

const canvas = document.getElementById("drawing");
const ctx = canvas.getContext("2d");

function norm(v) {
    return Math.sqrt(Math.pow(v[x], 2) +
		     Math.pow(v[y], 2));
}

function get_linkage_intersection(left, right, linkage_length) {
    let midpoint = [(left[x] + right[x]) / 2.0,
		    (left[y] + right[y]) / 2.0];
    let left_to_midpoint_length = norm([midpoint[x] - left[x],
				     midpoint[y] - left[y]]);
    let midpoint_to_top_length = Math.sqrt(Math.pow(linkage_length, 2) -
				    Math.pow(left_to_midpoint_length, 2));
    let base_v = [right[x] - left[x],
		  right[y] - left[y]];
    let base_v_len = norm(base_v);
    let unit_base_v = [base_v[x] / base_v_len,
		       base_v[y] / base_v_len];

    // Rotate pi/2 clockwise: (x,y) -> (-y, x)
    let unit_base_perpendicular = [-unit_base_v[y], unit_base_v[x]];

    return [midpoint[x] + unit_base_perpendicular[x]*midpoint_to_top_length,
	    midpoint[y] + unit_base_perpendicular[y]*midpoint_to_top_length];
};



const num_steps = 19000;
const total_time = 30;
function plot_for_step(current_step) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    for (step = 0; step < num_steps; step += 1) {
	t = total_time * (step / num_steps);
	let theta_a = t * omega_a * Math.PI;
	let theta_b = t * omega_b * Math.PI;
	let p_a_0 = [c_a[x] + r_a*Math.cos(theta_a),
		     c_a[y] + r_a*Math.sin(theta_a)];
	let p_b_0 = [c_b[x] + r_b*Math.cos(theta_b),
		     c_b[y] + r_b*Math.sin(theta_b)];

	let i_0 = get_linkage_intersection(
	    p_a_0, p_b_0, link_0_length);

	let p_a_1 = [(i_0[x] - p_a_0[x])*((link_0_length + link_1_length)/link_0_length)  + p_a_0[x],
		     (i_0[y] - p_a_0[y])*((link_0_length + link_1_length)/link_0_length)  + p_a_0[y]];
	let p_b_1 = [(i_0[x] - p_b_0[x])*((link_0_length + link_1_length)/link_0_length)  + p_b_0[x],
		     (i_0[y] - p_b_0[y])*((link_0_length + link_1_length)/link_0_length)  + p_b_0[y]];
	// B arm is left of A arm since arms crossed at i_0.
	let i_1 = get_linkage_intersection(
	    p_b_1, p_a_1, link_2_length);

	if (step == 0) {
	    ctx.moveTo(x_trans(i_1[x]),
		       y_trans(i_1[y]));
	} else {
	    ctx.lineTo(x_trans(i_1[x]),
		       y_trans(i_1[y]));

	}
    }
    ctx.lineWidth = 2;
    ctx.stroke();

    
    {
	// The above calculations so that we have the parts that need linkages, etc.
	t = total_time * (current_step / num_steps);
	let theta_a = t * omega_a * Math.PI;
	let theta_b = t * omega_b * Math.PI;
	let p_a_0 = [c_a[x] + r_a*Math.cos(theta_a),
		     c_a[y] + r_a*Math.sin(theta_a)];
	let p_b_0 = [c_b[x] + r_b*Math.cos(theta_b),
		     c_b[y] + r_b*Math.sin(theta_b)];
	let i_0 = get_linkage_intersection(
	    p_a_0, p_b_0, link_0_length);
	let p_a_1 = [(i_0[x] - p_a_0[x])*((link_0_length + link_1_length)/link_0_length)  + p_a_0[x],
		     (i_0[y] - p_a_0[y])*((link_0_length + link_1_length)/link_0_length)  + p_a_0[y]];
	let p_b_1 = [(i_0[x] - p_b_0[x])*((link_0_length + link_1_length)/link_0_length)  + p_b_0[x],
		     (i_0[y] - p_b_0[y])*((link_0_length + link_1_length)/link_0_length)  + p_b_0[y]];
	let i_1 = get_linkage_intersection(
	    p_b_1, p_a_1, link_2_length);


	ctx.beginPath();
	ctx.arc(x_trans(c_a[x]), y_trans(c_a[y]), baseline/2, 0, 2*Math.PI);
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(x_trans(c_b[x]), y_trans(c_b[y]), baseline/2, 0, 2*Math.PI);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(x_trans(p_a_0[x]), y_trans(p_a_0[y]));
	ctx.lineTo(x_trans(p_a_1[x]), y_trans(p_a_1[y]));
	ctx.lineTo(x_trans(i_1[x]), y_trans(i_1[y]));
	ctx.lineTo(x_trans(p_b_1[x]), y_trans(p_b_1[y]));
	ctx.lineTo(x_trans(p_b_0[x]), y_trans(p_b_0[y]));
	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(x_trans(p_a_0[x]), y_trans(p_a_0[y]));
	ctx.lineTo(x_trans(i_0[x]), y_trans(i_0[y]));
	ctx.lineWidth = 8;
	ctx.strokeStyle = 'rgba(255,0,0,.3)'
	ctx.stroke();


	ctx.beginPath();
	ctx.moveTo(x_trans(i_0[x]), y_trans(i_0[y]));
	ctx.lineTo(x_trans(p_a_1[x]), y_trans(p_a_1[y]));
	ctx.lineWidth = 8;
	ctx.strokeStyle = 'rgba(0,255,0,.3)'
	ctx.stroke();


	ctx.beginPath();
	ctx.moveTo(x_trans(p_a_1[x]), y_trans(p_a_1[y]));
	ctx.lineTo(x_trans(i_1[x]), y_trans(i_1[y]));
	ctx.lineWidth = 8;
	ctx.strokeStyle = 'rgba(200,200,0,.3)'
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(x_trans(i_1[x]), y_trans(i_1[y]));
	ctx.lineTo(x_trans(p_b_1[x]), y_trans(p_b_1[y]));
	ctx.lineWidth = 8;
	ctx.strokeStyle = 'rgba(200,0,200,.3)'
	ctx.stroke();


	ctx.beginPath();
	ctx.moveTo(x_trans(p_b_1[x]), y_trans(p_b_1[y]));
	ctx.lineTo(x_trans(i_0[x]), y_trans(i_0[y]));
	ctx.lineWidth = 8;
	ctx.strokeStyle = 'rgba(0,0,200,.3)'
	ctx.stroke();


	ctx.beginPath();
	ctx.moveTo(x_trans(i_0[x]), y_trans(i_0[y]));
	ctx.lineTo(x_trans(p_b_0[x]), y_trans(p_b_0[y]));

	ctx.lineWidth = 8;
	ctx.strokeStyle = 'rgba(100,200,200,.3)'
	ctx.stroke();
    }



}

//plot_for_step(700);

let anim_step = 0;
function animate(timestamp) {
    if (anim_step == num_steps) {
	anim_step = 0;
    }
    anim_step += 1;
    console.info(anim_step);
    plot_for_step(anim_step);
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
